import { Pool,Client } from 'pg';



let conn;
if (!conn) {
    conn =  new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        host: process.env.DB_SERVER,
        port: 5432,
        database: process.env.DB_NAME,
    });
}

// console.log('********************'+process.env.DB_NAME)
// Connect with a connection pool.

// async function poolDemo() {
//     const client = new Client({
//         user: process.env.DB_USER,
//         password: process.env.DB_PWD,
//         host: process.env.DB_SERVER,
//         port: 5432,
//         database: process.env.DB_NAME,
//     });
//     const now = await conn.query("SELECT NOW()");
//         await conn.end();
  
//     return now;
//   }


//   (async () => {
//     const poolResult = await poolDemo();
//     console.log("Time with pool: " + poolResult.rows[0]["now"]);
  
//   })();
//  console.log(process.env.DB_NAME)

 export { conn };

