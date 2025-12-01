import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Електронна пошта обов'язкова"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Пароль обов'язковий"],
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    color: {
        type: Number,
        required: false
    },
    profileSetup: {
        type: Boolean,
        default: false
    }
})

userSchema.pre("save", async function () {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
})

const User = mongoose.model("Users", userSchema)

export default User