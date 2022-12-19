import { PrismaClient } from "@prisma/client";

export default async (NextApiRequest,NextApiResponse)=> {
  const { email, password } = NextApiRequest.body;
const prisma = new PrismaClient();
const {method} = NextApiRequest;
switch(method){
  case "POST":
  const userOne = await prisma.user.findFirst({
    where: {
      Email: email,
      Pass : password
    },
  })



  return NextApiResponse.status(200).json({userOne});  
 default:
  return NextApiResponse.status(400).json("Connect Fail");
}
}