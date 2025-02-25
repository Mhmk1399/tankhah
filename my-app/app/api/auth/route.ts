import connect from "@/lib/data";
import { NextResponse, NextRequest } from "next/server";
import { User } from "@/models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Fixed require() style import

export async function POST(request: NextRequest) {
  const { name, phoneNumber, password } = await request.json();

  try {
    await connect();
    if (!connect) {
      return NextResponse.json(
        { message: "Error connecting to database" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      phoneNumber,
      password: hashedPassword,
      role: "user",
    });
    const secret = process.env.JWT_SECRET || "1234";
    const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: "100h" });
    newUser.token = token;

    await newUser.save();

    return NextResponse.json(
      {
        message: "user account created successfully",
        redirectUrl: "http://localhost:3000",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("خطا در ساخت حساب کاربری", err);
    return NextResponse.json(
      { message: "خطا در ساخت حساب کاربری" },
      { status: 500 }
    );
  }
}
export async function GET(request: NextRequest) {
  try {
    await connect();
    if (!connect) {
      return NextResponse.json(
        { message: "Error connecting to database" },
        { status: 500 }
      );
    }
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "1234"
    ) as jwt.JwtPayload;
    console.log("Decoded token:", decodedToken);

    if (!decodedToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findById((decodedToken as jwt.JwtPayload).id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const users = await User.findOne({ _id: decodedToken.id });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { message: "خطا در دریافت کاربران" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connect();
    if (!connect) {
      return NextResponse.json(
        { message: "Error connecting to database" },
        { status: 500 }
      );
    }
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "1234"
    ) as jwt.JwtPayload;
    console.log("Decoded token:", decodedToken);
    if (!decodedToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findById((decodedToken as jwt.JwtPayload).id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const { name, phoneNumber,
      password,
      role,
    } =
      await request.json();

    user.name = name;
    user.phoneNumber = phoneNumber;
    user.password = password;
    user.role = role;


    await user.save();
    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { message: "خطا در به روز رسانی کاربر" },
      { status: 500 }
    );
  }
}

