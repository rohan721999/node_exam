const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userDataModel = require('../models/userDataModel');
const jwt = require('jsonwebtoken');
const { Validator } = require('node-input-validator');

const MySecretToken = "myfirsttoken123";

router.get('/', (req, res) => {
    userDataModel.find().then((data) => {
        res.json(data);
    });
});

router.get('/auth', (req, res) => {
    userDataModel.findOne({email:req.body.email}).then((uData) => {
        bcrypt.compare(req.body.password, uData.password).then((valid) => {
            if(valid) {
                accessToken = jwt.sign({'email' : uData.email} , MySecretToken, { expiresIn: Math.floor(Date.now() / 1000) + 5 * 60 });
                res.json({"access_token" : accessToken}); // expire in 5 minutes
            } else {
                res.json({"error" : "User is not valid"});
            }
        })
    });
});

router.post('/register', async (req, res) => {
    try{
        const isValid = new Validator(req.body, {
            name : 'required',
            email : 'required|email',
            password: 'required|minLength:8'
        })

        await isValid.check().then((valid) => {
            if(!valid) {
                res.send(isValid.errors);
            } else {
                var userData = req.body;
                const passwordd = userData.password;
                let passw = bcrypt.hash(passwordd, 10).then((datsa) => {
                    userData.password = datsa;
                    const addUser = new userDataModel(userData);
                    addUser.save().then((data)=>{
                        if(data) {
                            res.json(data);
                        } else {
                            res.json({"error" : "User Data not added"})
                        }
                    });
                });
            }
        });
    } catch (err) {
        res.json(err);
    }
});

router.get('/:id', async (req, res) => {
    await userDataModel.find({'_id' : req.params.id}).then((data) => {
        res.json(data);
    });
});

router.put('/:id', async (req, res) => {
    try{
        const isValid = new Validator(req.body, {
            name : 'required',
            email : 'required|email',
            password: 'required'
        })

        await isValid.check().then((valid) => {
            if(!valid) {
                res.send(isValid.errors);
            } else {

                var userData = req.body;
                const passwordd = userData.password;
                let passw = bcrypt.hash(passwordd, 10).then((datsa) => {
                    userData.password = datsa;
                    const editUser = new userDataModel(userData);
                    editUser._id = req.params.id;
                    userDataModel.findByIdAndUpdate(req.params.id, editUser).then( data => {
                        res.json(data);
                    });
                });
                
            }
        });
    } catch (err) {
        res.json(err);
    }
});

router.delete('/:id', async (req, res) => {
    await userDataModel.findByIdAndDelete(req.params.id).then(() => {
        res.json({"success" : "Deleted Successfully"})
    });
});

module.exports = router;