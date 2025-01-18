import mongoose from "mongoose";
const requestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },


}
, { timestamps: true });
export const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);

