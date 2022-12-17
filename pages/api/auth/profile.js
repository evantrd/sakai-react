import { verify } from 'jsonwebtoken';




export default function profileHandler(req, res) {
    
const {userToken} = req.cookies

if(!userToken){
  return res.status(401).json({ error: 'invalid email or password' });
}
    try {
        const user = verify(userToken, 'envUserSecret');
        console.log(user);
        return res.json({email:user.email ,name:user.username})
    } catch (error) {
        return res.status(401).json({ error: 'invalid email or password' });
    }
}
