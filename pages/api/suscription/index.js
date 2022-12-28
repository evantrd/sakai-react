import {conn} from '../../../utils/database'
export default async (NextApiRequest,NextApiResponse)=> {
const {method,body} = NextApiRequest;

const CompanyId =  'cf5a25a9c4c4413296f02b67c0298a8d'


switch(method){
case "GET":try {
  const query = {
    // give the query a unique name
    name: 'fetch-suscription-GET',
    text: 'select "Name" name,msm."MemberId" "id",ms."Id"::int4 "code" from iqsoft.messaging_suscription_company as msc   inner join iqsoft.messaging_suscription as ms on ms."Id" = msc."SuscriptionId" inner  join iqsoft.messaging_suscription_member as msm on msm."SuscriptionId" = ms."Id" WHERE msc."CompanyId" = $1 union all select "Name" name, -1 "id" ,ms."Id"::int4 "code" from iqsoft.messaging_suscription_company as msc   inner join iqsoft.messaging_suscription as ms on ms."Id" = msc."SuscriptionId"  WHERE msc."CompanyId" = $1',
    values: [CompanyId],
  }
   const res = await conn.query(query)
   return NextApiResponse.status(200).json(res.rows);
  }catch(error){
    return NextApiResponse.status(500).json({message: error.message});
  }
  
case "POST":try {

  const text = 'INSERT INTO iqsoft.messaging_suscription_member ("Active", "IdUserCreated", "DateCreated", "IdUserModified", "DateModified", "MemberId", "SuscriptionId", "Order")   select true "Active", 1 "IdUserCreated", now() "DateCreated", null "IdUserModified", NULL"DateModified", "isSelected", "code" , null "Order" from json_populate_recordset (null::record,$1) AS ( "id" int ,"code" int,"isSelected" int );'

  const res = await conn.query(text,[JSON.stringify(body)]);
return NextApiResponse.status(200).json(res.rows[0]);
}catch(error){
  return NextApiResponse.status(500).json({message: error.message});
}
case "DELETE":try {

  const query = {
    // give the query a unique name
    name: 'fetch-suscription-DELETE',
    text: 'DELETE     FROM iqsoft.messaging_suscription_member msm     USING iqsoft.messaging_suscription_company msc   WHERE msm."SuscriptionId" = msc."SuscriptionId" AND    msc."CompanyId" =  $1   AND    msm."MemberId" = $2 RETURNING *',  values: [CompanyId,body.Id] }
      const res = await conn.query(query)

      if (res.rowCount === 0){
        return NextApiResponse.status(400).json({message: 'No data'})
      }
   return NextApiResponse.status(200).json(res.rows[0]);
  }catch(error){
    return NextApiResponse.status(500).json({message: error.message});
  }
  
 default:
  return NextApiResponse.status(400).json("Connect Fail");
}



};


