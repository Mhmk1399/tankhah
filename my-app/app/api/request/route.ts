import { NextRequest,NextResponse } from "next/server";
import connect from "@/lib/data";
import { getDataFromToken } from "@/lib/getDataFromToken";
import { Request } from "@/models/request";

export async function POST(request: NextRequest) { 
    await connect();
    if(!connect()) {
        return NextResponse.json({error: "Database connection error"}, {status: 500});
    }
  try {
   
    const userId = await getDataFromToken(request);
    const reqBody = await request.json();
    const { amount, description, Date } = reqBody;
    const newRequest = new Request({
      user: userId,
      amount,
      description,
      Date,
    });
    const savedRequest = await newRequest.save();
    return NextResponse.json({
      message: "Request created successfully",
      success: true,
      savedRequest,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  await connect();
  if(!connect()) {
      return NextResponse.json({error: "Database connection error"}, {status: 500});
  }
  try {
    const userId = await getDataFromToken(request);
    const requests = await Request.find({ user: userId });
    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await connect();
  if(!connect()) {
      return NextResponse.json({error: "Database connection error"}, {status: 500});
  }
  try {
    const userId = await getDataFromToken(request);
    const reqBody = await request.json();
    const { id } = reqBody;
    const deletedRequest = await Request.findByIdAndDelete(id);
    return NextResponse.json({
      message: "Request deleted successfully",
      success: true,
      deletedRequest,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  await connect();
  if(!connect()) {
      return NextResponse.json({error: "Database connection error"}, {status: 500});
  }
  try {
    const userId = await getDataFromToken(request);
    const reqBody = await request.json();
    const { id, amount, description, Date } = reqBody;
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { amount, description, Date },
      { new: true }
    );
    return NextResponse.json({
      message: "Request updated successfully",
      success: true,
      updatedRequest,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}