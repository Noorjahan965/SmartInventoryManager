import User from '../model/userModel.js';
import bcrypt from 'bcrypt';

export const getUserService = async () => {
    try {
        const users = await User.find().select("-password");
        return { status: 200, message: 'Get all user.', users };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};


export const createUserService = async (userName, password, role) => {
    try {
        const user = await User.findOne({ userName }).exec();

        if(user) return {status: 400, message: 'Username already exist.'};

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            userName: userName,
            password: hashedPassword,
            role: role
        });

        return { status: 201, message: 'User account created successfully.', user: {
            userId: newUser._id,
            userName: newUser.userName,
            role: newUser.role
        } };
    }
    catch(err) {
        return { status: 500, message: err.message};
    }
}

export const loginUserService = async (userName, password) => {
    try {
        const user = await User.findOne({ userName }).exec();

        if(!user) return {status: 404, message: 'User not found'};

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(isPasswordCorrect) {
            return { status: 200, message: 'Login successfully.', user: {
                userId: user._id,
                userName: user.userName,
                role: user.role
            } };
        }
        else {
            return {status: 401, message: 'Invalid password'};
        }
    }
    catch(err) {
        return { status: 500, message: err.message };
    }
}

export const updateUserService = async (userId, userName, password, role) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { status: 404, message: "User not found." };
        }
        if (userName) user.userName = userName;
        if (password) user.password = await bcrypt.hash(password, 12);
        if (role) user.role = role;
        await user.save();

        return { status: 200, message: "User updated successfully.", user: {
                userId: user._id,
                userName: user.userName,
                role: user.role
            }
        };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};

export const deleteUserService = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if(!user) {
            return { status: 404, message: 'User not found!' };
        }
        return { status: 200, message: 'User deleted successfully.' };
    }
    catch(err) {
        return { status: 500, message: err.message };
    }
}