import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import { Outcome } from "@/models/transactions/outcome";
import { Request } from "@/models/request";
import { verifyJwtToken } from "@/lib/verifyJwtToken";

export async function GET(req: NextRequest) {
    try {
        await connect();
        const token = req.headers.get("authorization")?.split(" ")[1];
        const decoded = await verifyJwtToken(token);

        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Get accepted requests (incomes)
        const acceptedRequests = await Request.find({ 
            user: decoded.id,
            status: "approved"
        });
        console.log(acceptedRequests)

        // Get all outcomes
        const outcomes = await Outcome.find({ user: decoded.id });

        // Calculate total incomes from accepted requests
        const totalIncomes = acceptedRequests.reduce((sum, req) => sum + req.amount, 0);

        // Calculate total outcomes
        const totalOutcomes = outcomes.reduce((sum, outcome) => sum + outcome.amount, 0);

        // Calculate wallet balance
        const walletBalance = totalIncomes - totalOutcomes;

        return NextResponse.json({
            totalIncomes,
            totalOutcomes,
            walletBalance
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Error calculating wallet values", details: error },
            { status: 500 }
        );
    }
}
