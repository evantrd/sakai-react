import {conn} from '../../utils/database'

export default async (NextApiRequest,NextApiResponse)=> {
const {method} = NextApiRequest;

switch(method){
case "GET":
   const ping = await conn.query("Select NOW()")
  return NextApiResponse.status(200).json('pong');
case "POST":
  return NextApiResponse.status(200).json("post");
 default:
  return NextApiResponse.status(400).json("Connect Fail");
}


};


