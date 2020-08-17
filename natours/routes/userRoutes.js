const express = require('express');
const {
    getAllUsers,
    createUser,
    getUser,
    deleteUser,
    updateUser,
    updateMe
} = require('../controllers/userController');

const { signup, login, forgotPassword, resetPassword, protect, updatePassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .delete(deleteUser)
    .patch(updateUser);

module.exports = router;
