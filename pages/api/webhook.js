/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';

export default async (NextApiRequest, NextApiResponse) => {
    const prisma = new PrismaClient();
    const { method } = NextApiRequest;
    const verify_token = process.env.VERIFY_TOKEN;

    switch (method) {
        case 'GET':
            let mode = NextApiRequest.query['hub.mode'];
            let token = NextApiRequest.query['hub.verify_token'];
            let challenge = NextApiRequest.query['hub.challenge'];

            // Check if a token and mode were sent
            if (mode && token) {
                // Check the mode and token sent are correct
                if (mode === 'subscribe' && token === verify_token) {
                    // Respond with 200 OK and challenge token from the request
                    console.log('WEBHOOK_VERIFIED');
                    return   NextApiResponse.status(200).send(challenge);
                }
            }
            //const messagingProduct = await prisma.messaging_product.findMany();
            return NextApiResponse.status(200).json('hola');
        case 'POST':
            return NextApiResponse.status(200).json('post');
        default:
            return NextApiResponse.status(400).json('Connect Fail');
    }
};
