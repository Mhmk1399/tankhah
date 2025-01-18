import { Category } from "@/models/category";
import connect from "@/lib/data";
import { NextResponse,NextRequest } from "next/server";
import { getDataFromToken } from "@/lib/getDataFromToken";



export const GET = async (req: NextRequest) => {
    try {
        await connect();
        const id= getDataFromToken(req);
        const categories = await Category.find({user:id});
        return NextResponse.json({
            success: true,
            categories,
        });
    } catch (error: unknown) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        await connect();
        const id= await getDataFromToken(req);
        const reqBody = await req.json();
        const newCategory = new Category({
            ...reqBody,
            user: id

        });
        const savedCategory = await newCategory.save();
        return NextResponse.json({
            success: true,
            savedCategory,
        });
    } catch (error: unknown) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    }
};
