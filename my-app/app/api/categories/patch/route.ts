import { Category } from "@/models/category";
import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function PATCH(req: NextRequest) {
    try {
        await connect();
        const userId = await getDataFromToken(req);
        const id = await req.headers.get('id');
        console.log(req.headers);
        const reqBody = await req.json();
        
        const updatedCategory = await Category.findOneAndUpdate(
            { user: userId , _id: id },
            reqBody,
            { new: true }
        );

        return NextResponse.json({
            success: true,
            category: updatedCategory
        });
    } catch (error: unknown) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    }
}
