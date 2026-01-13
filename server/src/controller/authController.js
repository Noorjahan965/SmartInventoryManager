import jwt from 'jsonwebtoken';

import { response } from '../utils/response.js';
import { getUserService, createUserService, loginUserService, updateUserService, deleteUserService } from '../service/authService.js';

export const getAllUser = async (req, res) => {
    if(req.user.role !== 'ADMIN') {
        return res.status(401).send(response('FAILED', 'Admin only able to create user!', null));
    }
    try {
        const result = await getUserService();
        if(result.status === 500) {
            return res.status(500).send(response('FAILED', result.message, null));
        }
        else if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, { users: result.users }));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const createUser = async (req, res) => {
    if(req.user.role !== 'ADMIN') {
        return res.status(401).send(response('FAILED', 'Admin only able to create user!', null));
    }
    const { userName, password, role } = req.body;
    if(!userName.trim()) {
        return res.status(400).send(response('FAILED', 'Please enter your username.', null));
    }
    if(!password.trim()) {
        return res.status(400).send(response('FAILED', 'Please enter your password.', null));
    }
    if(!role.trim()) {
        return res.status(400).send(response('FAILED', 'Please enter your role.', null));
    }

    try {
        const result = await createUserService(userName, password, role);
        if(result.status === 500 || result.status === 400) {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
        else if(result.status === 201) {
            return res.status(201).send(response('SUCCESS', result.message, {
                user: result.user
            }))
        }
        
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const loginUser = async (req, res) => {
    const { userName, password } = req.body;
    
    if(!userName.trim()) {
        return res.status(400).send(response('FAILED', 'Please enter your username.', null));
    }
    if(!password.trim()) {
        return res.status(400).send(response('FAILED', 'Please enter your password.', null));
    }

    try {
        const result = await loginUserService(userName, password);

        if(result.status === 401 || result.status === 404) {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
        else if(result.status === 200) {
            const payload = {
                userId: result.user.userId,
                role: result.user.role
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '365d'});
            return res.status(200).send(response('SUCCESS', result.message, { jwtToken: token, user: result.user }));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}

export const verifiedToken = async (req, res) => {
    return res.status(200).json({ valid: true, user: req.user });
}

export const updateUser = async (req, res) => {
    if(req.user.role !== 'ADMIN') {
        return res.status(401).send(response('FAILED', 'Admin only able to modify user!', null));
    }
    
    const { userId, userName, password, role } = req.body;
    try {
        const result = await updateUserService(userId, userName, password, role);

        if(result.status === 404 || result.status === 500) {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
        else if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, { user: result.user }));
        }
        
    }
    catch {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}


export const deleteUser = async (req, res) => {
    if(req.user.role !== 'ADMIN') {
        return res.status(401).send(response('FAILED', 'Admin only able to delete user!', null));
    }

    const { userId } = req.body;

    try {
        const result = await deleteUserService(userId);
        if(result.status === 404 || result.status === 500) {
            return res.status(result.status).send(response('FAILED', result.message, null));
        }
        else if(result.status === 200) {
            return res.status(200).send(response('SUCCESS', result.message, null));
        }
    }
    catch(err) {
        return res.status(500).send(response('FAILED', err.message, null));
    }
}