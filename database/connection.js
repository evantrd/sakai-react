//const sql = require('mssql')
import sql from 'mssql'
import config from '../config.js' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import




const sqlConfig = {
    user: config.dbUser,
    password: config.dbPass,// process.env.DB_PWD,
    database: config.dbName,//process.env.DB_NAME,
    server: config.dbServer,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 60000
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: true, // change to true for local dev / self-signed certs
      useUTC:true,
      enableArithAbort: true
    },
  };



  
export async function getConnection(){
    try{
        const pool = await sql.connect(sqlConfig);
        return(pool);          
    }catch(error){
        console.error(error);
    }
}

export  {sql};

