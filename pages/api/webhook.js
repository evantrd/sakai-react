/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

'use strict';
//import './database/connection'
//const sql = require('./database/connection.js')
// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
// import req1 from "request";
// import express from "express";
import { NextApiRequest, NextApiResponse } from 'next';
// import body_Parser from "body-parser";
 import axios from "axios";
 import config from "./config.js";
// import cors from 'cors'
// import Promise from "bluebird";
// import messaginProduct from "./messaginProduct.routes.js";
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';
const prisma = new PrismaClient();

export default async (NextApiRequest, NextApiResponse) => {
    
    const { method } = NextApiRequest;
   
    switch (method) {
        case 'GET':
            const verify_token = process.env.VERIFY_TOKEN;
               // Parse params from the webhook verification request
           // const query = NextApiRequest.query;
            // const { mode='hub.mode', token='hub.verify_token',challenge='hub.challenge'} = query;
            const {
                query: {kmode='hub.mode',ktoken='hub.verify_token',kchallenge='hub.challenge' },
                method,
              } = NextApiRequest;

            let mode = NextApiRequest.query['hub.mode'];
            let token = NextApiRequest.query['hub.verify_token'];
            let challenge = NextApiRequest.query['hub.challenge'];
            // Check if a token and mode were sent
             if (mode && token) {
                // Check the mode and token sent are correct
                if (mode === 'subscribe' && token === verify_token) {
                    // Respond with 200 OK and challenge token from the request
                    console.log('WEBHOOK_VERIFIED');
            return         NextApiResponse.status(200).send(challenge);
                } else {
                    // Responds with '403 Forbidden' if verify tokens do not match
                    NextApiResponse.status(403);
                    console.log('WEBHOOK_FAILS');
                }
            }
        case 'POST':
            // Parse the request body from the POST
            let body = NextApiRequest.body;

            // Check the Incoming webhook message
            console.log(JSON.stringify(NextApiRequest.body, null, 2));
            console.log(NextApiRequest.body);
            console.log(NextApiRequest.host);
            console.log(NextApiRequest.method);

               
            // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
            if (NextApiRequest.body.object) {
                if (NextApiRequest.body.entry && NextApiRequest.body.entry[0].changes && NextApiRequest.body.entry[0].changes[0] && NextApiRequest.body.entry[0].changes[0].value.messages && NextApiRequest.body.entry[0].changes[0].value.messages[0]) {
                    let phone_number_id = NextApiRequest.body.entry[0].changes[0].value.metadata.phone_number_id;
                    let from = NextApiRequest.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
                    let msg_type = NextApiRequest.body.entry[0].changes[0].value.messages[0].type; // extract the message text from the webhook payload
                    let msg_timestamp = NextApiRequest.body.entry[0].changes[0].value.messages[0].timestamp; // extract the message text from the webhook payload
                    let msg_id = NextApiRequest.body.entry[0].changes[0].value.messages[0].id; // extract the message text from the webhook payload
                    let msg_contacts = NextApiRequest.body.entry[0].changes[0].value.contacts[0].profile.name; // extract the message text from the webhook payload

                    var msg_Action;
                    var msg_context_id = null;
                    var img_id = null;
                    var img_caption = null;
                    var img_type = null;
                    var img_sha256 = null;

                    if (msg_type === 'text') {
                        let msg_body = NextApiRequest.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
                        console.log('mensaje ' + msg_body);
                        msg_Action = msg_body;
                    } else {
                        console.log('No Body');
                    }

                    if (msg_type === 'button') {
                        let msg_button = NextApiRequest.body.entry[0].changes[0].value.messages[0].button.payload; // extract the message text from the webhook payload
                        msg_context_id = NextApiRequest.body.entry[0].changes[0].value.messages[0].context.id; // extract the phone number from the webhook payload
                        console.log('accion del boton ' + msg_button);
                        console.log('Respuesta a mensaje id ' + msg_context_id);
                        msg_Action = msg_button;
                    } else {
                        console.log('No Button');
                    }

                    if (msg_type === 'image') {
                        img_type = NextApiRequest.body.entry[0].changes[0].value.messages[0].image.mime_type; // extract the message text from the webhook payload
                        img_sha256 = NextApiRequest.body.entry[0].changes[0].value.messages[0].image.sha256; // extract the phone number from the webhook payload
                        img_id = NextApiRequest.body.entry[0].changes[0].value.messages[0].image.id; // extract the phone number from the webhook payload
                        img_caption = NextApiRequest.body.entry[0].changes[0].value.messages[0].image.caption; // extract the phone number from the webhook payload

                        console.log('image type ' + img_type);
                        console.log('image sha256' + img_sha256);
                        console.log('image id' + img_id);
                        //console.log("image caption "+img_caption||"no mesagge");
                        console.log('msg id ' + msg_id);
                        // msg_Action = img_caption||"no mesagge";

                        const imgData = {
                            wamid: msg_id,
                            image_id: img_id,
                            image_caption: img_caption || '',
                            image_type: img_type,
                            image_sha256: img_sha256
                        };
                        console.log(imgData);

                        //const element = document.querySelector('#post-request .msg-id');
                        axios.post('http://localhost:3000/api/image', imgData);
                        //.then(response => element.innerHTML = response.data.id);
                    } else {
                        console.log('no imagen');
                    }

                    if (msg_type === 'audio') {
                        let audio_type = NextApiRequest.body.entry[0].changes[0].value.messages[0].audio.mime_type; // extract the message text from the webhook payload
                        let audio_sha256 = NextApiRequest.body.entry[0].changes[0].value.messages[0].audiosha256; // extract the phone number from the webhook payload
                        let audio_id = NextApiRequest.body.entry[0].changes[0].value.messages[0].audio.id; // extract the phone number from the webhook payload

                        console.log('Audio type ' + audio_type);
                        console.log('Audio sha256' + audio_sha256);
                        console.log('Audio id' + audio_id);

                        const audio = {
                            wamid: msg_id,
                            audio_id: audio_id,
                            audio_type: audio_type,
                            audio_sha256: audio_sha256
                        };
                        console.log(audio);

                        //const element = document.querySelector('#post-request .msg-id');
                        axios.post('http://localhost:3000/api/audio', audio);
                        //.then(response => element.innerHTML = response.data.id);
                    } else {
                        console.log('No Audio');
                    }

                    console.log('Phone_id ' + phone_number_id);
                    console.log('origen ' + from);
                    console.log('Nombre ' + msg_contacts);
                    console.log('Id ' + msg_id);
                    console.log('Mensaje ' + msg_Action);
                    console.log('Tipo de mensaje ' + msg_type);

                    const msg = {
                        phone_id: phone_number_id,
                        company_id: null,
                        msg_type: msg_type,
                        wamid: msg_id,
                        wam_id_parent: msg_context_id || null,
                        contact_id: msg_contacts,
                        receipt_phone: from,
                        msg_text: msg_Action || 'No Msg',
                        template_id: '',
                        msg_status: 'send',
                        msg_stamp: new Date(),
                        stamp: new Date()
                    };

                    // const element = document.querySelector('#post-request .msg-id');
                    axios.post('http://localhost:3000/api/message', msg);
                    //.then(response => element.innerHTML = response.data.id);
                }
                return NextApiResponse.status(200).json('WEBHOOK_VERIFIED');
            } else {
                // Return a '404 Not Found' if event is not from a WhatsApp API
                console.log('no impresion de mensajes');
                return    NextApiResponse.send(404);
            }
        default:
            return NextApiResponse.status(400).json('fallo');
    }
};
