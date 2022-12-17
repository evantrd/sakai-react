import {config} from 'dotenv';
config();


export default{
           port:process.env.PORT,
           dbUser:process.env.DB_USER,
           dbPass: process.env.DB_PWD,
           dbServer: process.env.DB_SERVER,
           dbName: process.env.DB_NAME,
     };
  