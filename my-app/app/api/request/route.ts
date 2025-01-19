import { NextRequest,NextResponse } from "next/server";
import connect from "@/lib/data";
import { getDataFromToken, getRoleFromToken } from "@/lib/getDataFromToken";
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
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
  
}

export async function GET(request: NextRequest) {
  await connect();
  if(!connect()) {
      return NextResponse.json({error: "Database connection error"}, {status: 500});
  }
  try {
   const role= await getRoleFromToken(request);
    if (role === "manager") {
      const requests = await Request.find();
      return NextResponse.json({ requests });
    }else {
       const userId = await getDataFromToken(request);
      const requests = await Request.find({ user: userId });
    return NextResponse.json({ requests });
    }
   
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
  
}

export async function DELETE(request: NextRequest) {
  await connect();
  if(!connect()) {
      return NextResponse.json({error: "Database connection error"}, {status: 500});
  }
  try {
    const reqBody = await request.json();
    console.log(reqBody);
    
    const id  = reqBody.id;
    const deletedRequest = await Request.findByIdAndDelete(id);
    return NextResponse.json({
      message: "Request deleted successfully",
      success: true,
      deletedRequest,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
  
}

export async function PATCH(request: NextRequest) {
  await connect();
  if(!connect()) {
      return NextResponse.json({error: "Database connection error"}, {status: 500});
  }
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const reqBody = await request.json();
    console.log(reqBody);
    const { id, amount, description, Date,status} = reqBody;
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { amount, description, Date, status },
      { new: true }
    );
    return NextResponse.json({
      message: "Request updated successfully",
      success: true,
      updatedRequest,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
  
}