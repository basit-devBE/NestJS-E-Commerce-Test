import bcrypt from 'bcryptjs';

export const hashPassword = async(password:string):Promise<string> =>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to hash password: ${error.message}`);
        } else {
            throw new Error("An unexpected error occurred while hashing the password.");
        }
    }
}

export const comparePassword = async(password:string, hashedPassword:string):Promise<boolean> =>{
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to compare password: ${error.message}`);
        } else {
            throw new Error("An unexpected error occurred while comparing the password.");
        }
    }
}