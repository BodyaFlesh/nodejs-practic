const express = require('express');
const router = express.Router();
const UserService = require("./UserService");
const { check, validationResult } = require("express-validator");

router.post('/api/1.0/users', 
    check("username")
        .notEmpty().withMessage("username_null")
        .bail()
        .isLength({min: 4, max: 32}).withMessage("username_size"),
    check("email")
        .notEmpty().withMessage("email_null"),  
    check("password").notEmpty().withMessage("password_size"), 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const validationErrors = {};
            errors.array().forEach(error => validationErrors[error.param] = req.t(error.msg));
            return res.status(400).send({validationErrors});
        }

        try{
            await UserService.save(req.body);

            return res.send({
                message: "User created"
            });
        }catch(err){
            return res.status(400).send({ validationErrors: { email: "E-mail in use" } });
        }
});


module.exports = router;