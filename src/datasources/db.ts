import pkg from 'pg';
const { Pool } = pkg;
import { CompetitionModel } from '../models';

export class PGDBDataSource {
    private dbConnection;
    private token;
    private user;
  
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

}