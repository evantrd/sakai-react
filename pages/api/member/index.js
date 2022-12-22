import { response } from 'express';
import {conn} from '../../../utils/database'

export default async (NextApiRequest,NextApiResponse)=> {
const {method,body} = NextApiRequest;
console.log(method)

const CompanyId =  'cf5a25a9c4c4413296f02b67c0298a8d'

switch(method){
case "GET": try {
  console.log('entro a'+method);
  const query = {
    // give the query a unique name
    name: 'fetch-user',
    text: 'select    c."Id"::int8 as "Id",   c."Active"::bool as "Active",   "FirstName", "LastName" ,   "IdentificationType",   "NoIdentification",   "GenderTypeId",      gt."Description" ,   "MaritalStatusId",    ms."Description" ,   "BornDate",   "CompanyId",   "Email",  "Phone1", "Phone2", "AddresId",a."Street" from   iqsoft.member c left join common.gender_type gt on "GenderTypeId"  = gt."Id"         left join common.address a  on "AddresId" = a."Id"  left join common.marital_status ms   on "MaritalStatusId"  = ms."Id" WHERE "CompanyId" = $1 order by "FirstName"',
    values: [CompanyId],
  }
   const res = await conn.query(query)
  return NextApiResponse.status(200).json(res.rows);
}catch(error){
  return NextApiResponse.status(500).json({message: error.message});
}
  case "PUT":try {
    console.log('entro a'+method);
    console.log(body);
    const  {Id,
      Active,
      FirstName,
      LastName,
      IdentificationType,
      NoIdentification,     
      GenderTypeId,
      MaritalStatusId,
      BornDate,
      Email,
      Phone1,
      Phone2, 
    } = body
  const query = {
    // give the query a unique name
    text: 'UPDATE  iqsoft.member  SET "Active" = $1,   "FirstName" = $2, "LastName" = $3 ,   "IdentificationType" = $4,   "NoIdentification" = $5,   "GenderTypeId" = $6,   "MaritalStatusId" = $7,  "BornDate" = $8,     "Email" = $9,  "Phone1" = $10, "Phone2" = $11  WHERE "Id" = $12',
    values : [ Active
      ,FirstName,
      LastName,
      IdentificationType,
      NoIdentification,     
      GenderTypeId,
      MaritalStatusId,
      BornDate,
      Email,
      Phone1.replace(/-/g,''),  
      Phone2.replace(/-/g,''),
      Id    
      ],
  }
   const res = await conn.query(query)
   console.log(res)
  return NextApiResponse.status(200).json(res.rows[0])
  
}catch(error){
  return NextApiResponse.status(500).json({message: error.message});
}
case "POST":try {
  console.log('entro a'+method);
  console.log(body);
  const  {Id,
    Active,
    FirstName,
    LastName,
    IdentificationType,
    NoIdentification,     
    GenderTypeId,
    MaritalStatusId,
    BornDate,
    Email,
    Phone1,
    Phone2, 
  } = body

 
  const text = 'INSERT INTO iqsoft.member ("Active", "IdUserCreated", "DateCreated", "IdUserModified", "DateModified", "FirstName", "LastName", "IdentificationType", "NoIdentification", "GenderTypeId", "MaritalStatusId", "BornDate", "CompanyId", "Email", "Phone1", "AddresId", "Phone2") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *'
  const values = [
    Active,
    1,
    new Date(),
    null,
    null,
    FirstName,
    LastName,
    IdentificationType,
    NoIdentification,     
    GenderTypeId,
    MaritalStatusId,
    BornDate,
    CompanyId,
    Email,
    Phone1.replace(/-/g,''),
    null,
    Phone2.replace(/-/g,'')    
    ]

    
  const res2 = await conn.query(text,values)
  return NextApiResponse.status(200).json(res2.rows);
}catch(error){
  return NextApiResponse.status(500).json({message: error.message});
}
 default:
  return NextApiResponse.status(400).json("Connect Fail");
}



};


