import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import { AdminModel } from '../models';

export class PGDBDataSource {
    private dbConnection;
    private token;
    private user;
    private saltRounds = 10;

  
    constructor() {
        this.dbConnection = this.initializeDBConnection();
    //   this.token = options.token;
    }
  
    initializeDBConnection() {
        const connection = new Pool();

        connection.on('connect', (client) => {
            client.query('SET search_path TO dancemanager,public');
        });

        return connection;
    }

    async getCompetitions() {
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
        const passwordHash = await this.hashPassword(password);
        const data = await this.dbConnection.query(`
            INSERT INTO ADMIN (username, email, password_hash) VALUES ('${username}', '${email}', '${passwordHash}') RETURNING id, username, email
        `);
        return data.rows[0];
    }

    async loginAdmin(username: string, password: string) {
        const data = await this.dbConnection.query(`SELECT * FROM ADMIN WHERE USERNAME='${username}'`);
        const admin = data.rows[0];

        if (admin) {
            const passwordCheck = await this.comparePasswords(password, admin.password_hash);
            return passwordCheck ? admin : null;
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

}