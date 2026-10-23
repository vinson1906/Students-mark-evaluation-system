const express = require('express');
const UserRouter = express.Router();
const controller = require('./user.controller');
const authMiddleware = require('../../middleware/authendication');

UserRouter.post('/create', controller.createUser);
UserRouter.get('/get', controller.getAllUsers);
UserRouter.get('/get/:id', controller.getUserById);
UserRouter.delete('/delete/:id', controller.deleteUser);
UserRouter.put('/update/:id', controller.updateUser);
UserRouter.post('/login', controller.login);
UserRouter.get('/auth-success', authMiddleware.authenticateUser, controller.authSuccess);


module.exports = UserRouter;