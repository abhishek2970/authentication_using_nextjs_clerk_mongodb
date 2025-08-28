import User from "../models/users.model";

import { connect } from "../mongodb/mongoose";

export const createOrUpdateUser = async (

     id
     , first_name, 
     last_name, username, image_url, email_addresses
) => {
    try {
        await connect();
        const user = await User.findOneAndUpdate(
            { clerkId: id },
            {
                $set: {
                clerkId: id,
                firstName: first_name,
                lastName: last_name,
                username: username,
                avatar: image_url,
                email: email_addresses[0]?.emailAddress || "",
                updatedAt: new Date(),
                },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return user;
    }
     catch (error) {
        console.error("Error in createOrUpdateUser:", error);
        throw error;
    }

   
   
}
export const deleteUser = async (clerkId) => {
    try {
        await connect();
        await User.findOneAndDelete({ clerkId });
    }
    catch (error) {
        console.error("Error in deleteUser:", error);
        throw error;
    }
}