/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

import {NextApiRequest,NextApiResponse} from 'next';
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";



export default async (NextApiRequest,NextApiResponse)=> {
const prisma = new PrismaClient();
const {method} = NextApiRequest;

switch(method){
case "GET":
  const messagingImage = await prisma.messaging_image.findMany();
  return NextApiResponse.status(200).json({messagingImage});
case "POST":
  const postMessagingImage = await prisma.messaging_image.create({
    data: NextApiRequest.body,
      });
      return NextApiResponse.status(200).json({postMessagingImage});
  console.log(NextApiRequest.body)
  
 default:
  return NextApiResponse.status(400).json("Connect Fail");
}
}