const express = require('express');
const router = express.Router();
const productModel = require('../models/productDataModel');
const { Validator } = require('node-input-validator');

router.get('/', (req, res) => {
    let searchBy = req.query;
    if(typeof searchBy != 'undefined' && Object.keys(searchBy).length !== 0) {
            let search = searchBy.search;
            productModel.find({$or:[{name:search} , {description : search}]}).then( (dataa) => {
                res.send(dataa);
            });
    } else {
        productModel.find().then((data) => {
            res.json(data);
        });
    }
});

router.post('/add', async (req, res) => {
    try{
        const isValid = new Validator(req.body, {
            name : 'required|alphaNumeric',
            price : 'required',
            productType: 'required',
            description: 'maxLength:255'
        })

        await isValid.check().then((valid) => {
            if(!valid) {
                res.send(isValid.errors);
            } else {
                const addProduct = new productModel(req.body);
                addProduct.save().then((data)=>{
                    if(data) {
                        res.json(data);
                    } else {
                        res.json({"sucess" : "nothing"})
                    }
                }).catch(err => {
                    res.json(err);
                }); 
            }
        })
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id', async (req, res) => {
    await productModel.find({'_id' : req.params.id}).then((data) => {
        res.json(data);
    });
});

router.put('/:id', async (req, res) => {
    try{
        const isValid = new Validator(req.body, {
            name : 'required',
            price : 'required',
            productType: 'required',
            description: 'maxLength:255'
        });
        await isValid.check().then((valid) => {
            if(!valid) {
                res.send(isValid.errors);
            } else {
                const editProduct = new productModel(req.body);
                editProduct._id = req.params.id;
                productModel.findByIdAndUpdate(req.params.id, editProduct).then( data => {
                    res.json(data);
                });
            }
        })
    } catch (err) {
        console.log(err);
    }
});

router.delete('/:id', async (req, res) => {
    await productModel.findByIdAndDelete(req.params.id).then(() => {
        res.json({"success" : "Deleted Successfully"})
    });
});

module.exports = router;