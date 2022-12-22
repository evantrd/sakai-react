import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import axios from 'axios';





export default async function loginHandler(req, res) {
    const { email, password } = req.body;

    // console.log(req.body);
    const response = await axios.post('http://localhost:3000/api/user',{ email, password }).catch(function (error) {
        if (error.response) {
            // La respuesta fue hecha y el servidor respondió con un código de estado
            // que esta fuera del rango de 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
            // http.ClientRequest en node.js
            console.log(error.request);
        } else {
            // Algo paso al preparar la petición que lanzo un Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
    if (response?.status === 200) {
        if (response?.data?.userOne === null){
            return res.status(401).send("Usuario Password invalidos");  
          }
        const { Email, Pass } = response?.data?.userOne;

      


        if (email === Email && password === Pass) {
            const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                    email: Email,
                    username: 'admin'
                },
                'envUserSecret'
            );

            const serialized = serialize('userToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                path: '/'
            });

            res.setHeader('Set-Cookie', serialized);
            return res.json('login succesfully');
        }

        res.status(401).json({ error: 'invalid email or password' });
    }
}
