
import User from "../models/User.js";

class UserDao {
    async create(data) {
        const user = await User.create(data)
        return user
    }

    async update(id, data) {
        const userUpdate = await User.findByIdAndUpdate(id, data)
        return userUpdate
    }

    async deleteOne(id) {
        const user = await User.deleteOne({ _id: id })
        return user
    }

    async getAll() {
        const users = await User.find()
        return users
    }

    async getById(id) {
        const user = await User.findById(id)
        return user
    }

    async getByUsername(username) {
        const user = await User.findOne({ username })
        return user
    }
}

export const userDao = new UserDao()