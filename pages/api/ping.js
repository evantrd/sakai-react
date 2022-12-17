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
  const messagingProduct = await prisma.messaging_product.findMany();
  return NextApiResponse.status(200).json({messagingProduct});
case "POST":
  return NextApiResponse.status(200).json("post");
 default:
  return NextApiResponse.status(400).json("Connect Fail");
}


};


