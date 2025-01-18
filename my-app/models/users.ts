import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["manager", "user"],
        deault: "user",
    }

},
    {timestamps: true},
);


export const User = mongoose.models.User || mongoose.model("User", userSchema);