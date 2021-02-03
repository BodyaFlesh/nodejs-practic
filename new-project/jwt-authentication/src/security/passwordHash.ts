import * as bcrypt from 'bcrypt';

export class PasswordHash{

    /**
     * @returns Hashed password
     * @param plainPassword Plain passwird
     */
    public static async hashPassword(plainPassword: string){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        return hashedPassword;
    }
}