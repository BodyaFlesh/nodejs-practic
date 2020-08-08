const express = require('express')
const { getAllUsers, createUser, getUser, deleteUser, updateUser } = require('../controllers/userController');

const router = express.Router();

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .delete(deleteUser)
    .patch(updateUser);


module.exports = router;

