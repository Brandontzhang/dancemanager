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

    async getCompetitions() : Promise<CompetitionModel[]> {
        const competitions = await this.dbConnection.query('SELECT * FROM competition');

        return competitions;
    }

}