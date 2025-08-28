import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: { type: String ,required:true},
    lastName: { type: String ,required:true}, 
    username: { type: String, required: true },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    // Add other fields as necessary
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);


export default User; 