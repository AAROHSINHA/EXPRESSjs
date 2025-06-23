import bcrypt from "bcrypt";

const saltRounds = 10; // how many rounds of successive encrypting (higher means more complexity and more time usage)

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}
