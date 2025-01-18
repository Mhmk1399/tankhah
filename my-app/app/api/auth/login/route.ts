import connect from "@/lib/data";
import { NextResponse, NextRequest } from "next/server";
import { User } from "@/models/users";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';



export async function POST(req: NextRequest) {
    const { phoneNumber, password } = await req.json();

    try {
        await connect();
        if (!connect) {
            return NextResponse.json(
                { message: "Error connecting to MongoDB" },
                { status: 500 }
            );
        }

        const user = await User.findOne({ phoneNumber });
        console.log(user);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json(
                { message: "خطا در ورود" },
                { status: 401 }
            );
        }

        // Generate a JWT token

        const tokenSecret = process.env.JWT_SECRET;
        if (!tokenSecret) {
            return NextResponse.json(
                { message: "JWT secret is not defined" },
                { status: 500 }
            );
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,

            },
            process.env.JWT_SECRET as string,
            { expiresIn: "5h" }
        );
        console.log(token);
        return NextResponse.json({
            token,
            message: "ورود با موفقیت انجام شد",
        });
    } catch (err: unknown) {
        console.error("خطا در ورود به حساب", err);
        return NextResponse.json({ message: "خطا در ورود به حساب" }, { status: 500 });
    }
}