import userSchema from "../Schema/userSchema.js"

export const insertUser=async(obj)=>{
    const saveUser= await userSchema(obj).save()
    return saveUser
}

export const getUserById = async (userId) => {
    try {
        const user = await userSchema.findById(userId);
        return user;
    } catch (error) {
        throw new Error("Error getting user by ID");
    }
};
export const getUserByEmail = async (email) => {
    try {
        const user = await userSchema.findOne({email});
        return user;
    } catch (error) {
        console.error("Detailed error getting user by email:", error); // Log the actual error

        throw new Error("Error getting user by email"); // Correct error message
    }
};


// Function to update user password
export const updateUserPassword = async (userId, newPassword) => {
    try {
        const user = await userSchema.findById(userId);
        if (!user) {
            return false;
        }

        user.password = newPassword; // Make sure to hash the password before saving in a real application
        await user.save();
        return true;
    } catch (error) {
        console.error("Error updating user password:", error);
        return false;
    }
};