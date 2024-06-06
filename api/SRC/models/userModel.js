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
        throw new Error("Error getting user by ID");
    }
};
