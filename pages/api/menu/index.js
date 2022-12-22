import {conn} from '../../../utils/database'

export default async (NextApiRequest,NextApiResponse)=> {
const {method} = NextApiRequest;

switch(method){
case "GET":
   const res = await conn.query('select  "DisplayTab" tab, "DisplayInterface" label, "IconInterface"  as icon, mi."Url" "to" from config.module_interface mi    inner join config.module_interface_tab mit on mit."Id"  = mi."ModuleInterfaceTabId" order by "ModuleInterfaceTabId","InterfaceOrder" ')
  return NextApiResponse.status(200).json(res.rows);
case "POST":
  return NextApiResponse.status(200).json("post");
 default:
  return NextApiResponse.status(400).json("Connect Fail");
}


};


