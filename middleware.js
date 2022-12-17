import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const userToken = req.cookies.get('userToken');

  
        if (userToken === undefined) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
        if (!userToken) {
            return res.status(401).json({ error: 'invalid email or password' });
        }
        try {
            const { payload } = await jwtVerify(userToken, new TextEncoder().encode('envUserSecret'));

            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
    }


export const config ={
  matcher: ['/','/pages/:patch*','/documentation']
}