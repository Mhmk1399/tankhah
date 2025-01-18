import mongoose from "mongoose";
const BugetSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
export const Buget = mongoose.models.Buget || mongoose.model('Buget', BugetSchema);