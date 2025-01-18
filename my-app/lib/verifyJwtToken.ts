

import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
    role: string;
}

export const verifyJwtToken = async (token?: string): Promise<JwtPayload | null> => {
    if (!token) return null;

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT secret is not defined');
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;
        return decoded;
    } catch (error) {
        console.log(error);
        return null;
    }
};