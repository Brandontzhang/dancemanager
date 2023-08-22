import pkg from 'pg';
const { Pool } = pkg;
 
export default class DBConnection {
    // pools will use environment variables
    // for connection information
    poolConnection = new Pool();
    
    // you can also use async/await

    getTime = async () => {
        const res = await this.poolConnection.query('SELECT NOW()');
        return res;
    }
}