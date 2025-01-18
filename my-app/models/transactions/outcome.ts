import mongoose from "mongoose";


const outcomeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "recipient",
        required: false,
    },
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bank",
        required: false,
    }


},
    {timestamps: true},
);


export const Outcome = mongoose.models.Outcome || mongoose.model("Outcome", outcomeSchema);