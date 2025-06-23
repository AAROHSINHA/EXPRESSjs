import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required:true,
        unique: true
    },
    displayName: {
        type: mongoose.Schema.Types.String,
        required:true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required:true
    }
})

// Compiling into model
const User = mongoose.model('User', userSchema);
// we use these model to perform actions
export default User;