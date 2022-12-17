import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default function loginHandler(req, res) {
    const { email, password } = req.body;
  console.log({ email, password })
    if (email === 'ivan.qzd@gmail.com' && password === '123456') {
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                email: 'ivan.qzd@gmail.com',
                username: 'admin'
            },
            'envUserSecret' );

        const serialized = serialize('userToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/'
        });

        res.setHeader('Set-Cookie', serialized);
        return res.json('login succesfully')
    }
    return res.status(401).json({error:'invalid email or password'})
}
