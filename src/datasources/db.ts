import pkg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminModel, JudgeModel } from '../models';
import { GraphQLError } from 'graphql';

const { Pool } = pkg;

export class PGDBDataSource {
    private dbConnection;
    private token;
    private saltRounds = 10;

  
    constructor(token? : string) {
        this.dbConnection = this.initializeDBConnection();
        this.token = token;
    }
  
    initializeDBConnection() {
        const connection = new Pool();

        connection.on('connect', (client) => {
            client.query('SET search_path TO dancemanager,public');
        });

        return connection;
    }

    async getCompetitions() {
        this.authenticateRole(this.token, 'ADMIN');
        const data = await this.dbConnection.query(`SELECT * FROM competition`);
        return data.rows;
    }

    async getJudgesByCompetitionId(compId : string) {
        const data = await this.dbConnection.query(`SELECT * FROM JUDGE WHERE COMPETITION=${compId}`);
        return data.rows;
    }

    async getContestantsByCompetitionId(compId : string) {
        const data = await this.dbConnection.query(`SELECT * FROM CONTESTANT WHERE COMPETITION=${compId}`);
        return data.rows;
    }

    async getEventsByCompetitionId(compId : string) {
        const data = await this.dbConnection.query(`SELECT * FROM EVENT WHERE COMPETITION=${compId}`);
        return data.rows;
    }

    async getEventQueueByCompetitionId(compId : string) {
        const data = await this.dbConnection.query(`SELECT * FROM EVENTQUEUE WHERE COMPETITION=${compId}`);
        return data.rows;
    }

    async createAdmin(username: string, password: string, email: string) : Promise<AdminModel> {
        this.authenticateRole(this.token, 'ADMIN');
        const passwordHash = await this.hashPassword(password);
        const data = await this.dbConnection.query(`
            INSERT INTO ADMIN (username, email, password_hash) VALUES ('${username}', '${email}', '${passwordHash}') RETURNING id, username, email
        `);
        return data.rows[0];
    }

    async createJudges(usernames: string[], password: string, competitionId: string) : Promise<JudgeModel[]> {
        this.authenticateRole(this.token, 'ADMIN');
        const passwordHash = await this.hashPassword(password);

        // TODO: Handle judge random # generator
        const newJudges = await Promise.all(usernames.map(async (name: string, index: number) => {
            const data = await this.dbConnection.query(`
                INSERT INTO JUDGE (username, password_hash, number, competitionId) VALUES ('${name}', '${passwordHash}', '${index}', '${competitionId}') RETURNING id, username, number
            `)
            return data.rows[0];
        }));

        return newJudges;
    }

    async loginAdmin(username: string, password: string) {
        const data = await this.dbConnection.query(`SELECT * FROM ADMIN WHERE USERNAME='${username}'`);
        const admin = data.rows[0];

        if (admin) {
            const passwordCheck = await this.comparePasswords(password, admin.password_hash);
            return passwordCheck ? this.generateToken(admin.id, username, 'ADMIN') : null;
        }

        return null;
    }

    async loginJudge(username: string, password: string, competitionid: string) {
        const data = await this.dbConnection.query(`SELECT * FROM JUDGE WHERE USERNAME='${username}' AND COMPETITIONID=${competitionid}`);
        const judge = data.rows[0];

        if (judge) {
            const passwordCheck = await this.comparePasswords(password, judge.password_hash);
            return passwordCheck ? this.generateToken(judge.id, username, 'judge') : null;
        }

        return null;
    }

    async hashPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);
        return hashedPassword;
      }
      
    async comparePasswords(enteredPassword: string, hashedPassword: string): Promise<boolean> {
        const passwordsMatch = await bcrypt.compare(enteredPassword, hashedPassword);
        return passwordsMatch;
    }

    generateToken(id: string, username: string, role: string) {
        let token = jwt.sign({
            id: id,
            username: username,
            role: role
        }, process.env.SECRET, { expiresIn: '1h' });

        return token;
    }

    verifyToken(token : string) {
        let verification = jwt.verify(token, process.env.SECRET);
        return verification;
    }

    // Checks that the token provided matches the role required
    authenticateRole(token: string, requiredRole: String) {
        const { role } = this.verifyToken(this.token);
        if (role !== requiredRole) {
            throw new GraphQLError("Invalid Authorization Error");
        }
    }

}