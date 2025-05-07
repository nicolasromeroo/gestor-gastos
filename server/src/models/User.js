
import mongoose, { Schema } from "mongoose";

const userCollection = "users"

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model("User", userSchema, userCollection)

export default User