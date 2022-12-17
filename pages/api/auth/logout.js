import { serialize } from 'cookie';
import { verify } from 'jsonwebtoken';




export default function logoutHandler(req, res) {
    
const {userToken} = req.cookies


if(!userToken){
  return res.status(401).json({ error: 'invalid email or password' });
}
    try {
        verify(userToken, 'envUserSecret');
        const serialized = serialize('userToken', null, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 0,
          path: '/'
      });
      res.setHeader('Set-Cookie', serialized);
      return res.json('logout succesfully')

    } catch (error) {
        return res.status(401).json({ error: 'invalid email or password' });
    }
}
