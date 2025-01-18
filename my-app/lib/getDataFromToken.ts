import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
    id: string;
}

export const getDataFromToken = (request: NextRequest) => {
    try {
        const authHeader = request.headers.get("authorization");
        console.log(authHeader);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error("No token provided");
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error("No token provided");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        return decodedToken.id;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Authentication failed: " + error.message);
        } else {
            throw new Error("Authentication failed: Unknown error");
        }
    }
};
