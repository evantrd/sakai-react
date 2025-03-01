import {conn} from '../../../utils/database'

export default async (NextApiRequest,NextApiResponse)=> {
const {method,body} = NextApiRequest;

const CompanyId =  '214'

switch(method){
case "GET": try {
  const query = {
    // give the query a unique name
    name: 'fetch-tray',
    text: 'select    c."Id"::int8 as "id",   c."Active"::bool as "Active",   "Description" as name, "Value" as value from  common.country_iva c where "CountryId" = $1',
    values: [CompanyId],
  }
   const res = await conn.query(query)
  return NextApiResponse.status(200).json(res.rows);
}catch(error){
  return NextApiResponse.status(500).json({message: error.message});
}
  case "PUT":try {
    const  {Id,
      Active,
      Description,
    
      InventoryControl,
      DateModified,     
      IdUserModified, 
    } = body
   
  const query = {
    // give the query a unique name
    text: 'UPDATE  common.country_iva  SET "Active" = $1,   "Description" = $2,    "InventoryControl" = $4,   "DateModified" = $5,   "IdUserModified" = $6  WHERE "Id" = $8 and "CompanyId" = $7',
    values : [ Active
      ,Description,
 
      InventoryControl,
      DateModified,     
      IdUserModified,CompanyId,Id  
      ],
  }
   const res = await conn.query(query)

  return NextApiResponse.status(200).json(res.rows[0])
  
}catch(error){
  return NextApiResponse.status(500).json({message: error.message});
}
case "POST":try {

  const  {Active
    ,Description,
 
    InventoryControl,
    DateModified,     
    IdUserModified,CompanyId,Id  
  } = body

  const text = 'INSERT INTO common.country_iva  ("Active", "IdUserCreated", "DateCreated", "IdUserModified", "DateModified", "Description","InventoryControl") VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'
  const values = [
    Active
    ,Description,
   
    InventoryControl,
    DateModified,     
    IdUserModified,CompanyId,Id  
    ]

    
  const res = await conn.query(text,values)
  console.log(res.rows[0]);
  return NextApiResponse.status(200).json(res.rows[0]);
}catch(error){
  return NextApiResponse.status(500).json({message: error.message});
}
case "DELETE":try {

 const  {Id  } = body

const query = {
  // give the query a unique name
  text: 'UPDATE  common.country_iva   SET "Active" = false  WHERE "CompanyId" = $1 and  "Id" = $2',
  values : [ 
    CompanyId,Id   
    ],
}
 const res = await conn.query(query)


return NextApiResponse.status(200).json(res.rows)

}catch(error){
return NextApiResponse.status(500).json({message: error.message});
}
 default:
  return NextApiResponse.status(400).json("Connect Fail");
}



};


