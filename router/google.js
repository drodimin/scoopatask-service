const express     = require('express');
const googleauth = require('../googleauth');
const router      =  new express.Router()

module.exports = router

router.get('/googleurl', async (req, res) => {
    try{
        const url = googleauth.createUrl();
        res.status(201).send(url)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/googlecode', async (req, res) => {
    try{
        code = req.query.code;
        googleauth.getToken(code)
        res.status(201).send(url)
    }catch(e){
        res.status(400).send(e)
    }
})
