import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import { Outcome } from "@/models/transactions/outcome";
import { verifyJwtToken } from "@/lib/verifyJwtToken";
import { getDataFromToken } from "@/lib/getDataFromToken";
export async function GET(req: NextRequest) {
    try {
        await connect();
        const token = req.headers.get("authorization")?.split(" ")[1];
        const decoded = await verifyJwtToken(token);

        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const incomes = await Outcome.find({ user: decoded.id })
            .populate('category')
            .populate('recipient')
            .populate('bank');

        return NextResponse.json(incomes);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching outcomes", detials: error }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connect();
        const token = req.headers.get("authorization")?.split(" ")[1];
        const decoded = await verifyJwtToken(token);

        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const outcome = await Outcome.create({
            ...data,
            user: decoded.id,
            date: data.date || new Date()
        });

        return NextResponse.json(outcome, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating outcome", detials: error }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest) {
    try {
        await connect();
        const userId = await getDataFromToken(req);
        const id = await req.headers.get('id');
        await Outcome.findOneAndDelete({ user: userId, _id: id });
        return NextResponse.json({
            success: true,
            message: "Outcome deleted successfully"
        })
    } catch (error: unknown) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    };

}

export async function PATCH(req: NextRequest) {
    try {
        await connect();
        const userId = await getDataFromToken(req);
        const id = await req.headers.get('id');
        const reqBody = await req.json();
        const updatedOutcome = await Outcome.findOneAndUpdate(
            { user: userId, _id: id },
            reqBody,
            { new: true }
        );
        return NextResponse.json({
            success: true,
            income: updatedOutcome
        });
    } catch (error: unknown) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    }
}