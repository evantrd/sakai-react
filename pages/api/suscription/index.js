import {conn} from '../../../utils/database'

export default async (NextApiRequest,NextApiResponse)=> {
const {method} = NextApiRequest;

const CompanyId =  'cf5a25a9c4c4413296f02b67c0298a8d'
const query = {
  // give the query a unique name
  name: 'fetch-user',
  text: 'select "Name" name, ms."Id"::int4 "id",ms."Id"::text "code" from iqsoft.messaging_suscription_company as msc   inner join iqsoft.messaging_suscription as ms on ms."Id" = msc."SuscriptionId"  WHERE msc."CompanyId" = $1',
  values: [CompanyId],
}

switch(method){
case "GET":
   const res = await conn.query(query)
  return NextApiResponse.status(200).json(res.rows);
case "POST":
  return NextApiResponse.status(200).json("post");
 default:
  return NextApiResponse.status(400).json("Connect Fail");
}



};


