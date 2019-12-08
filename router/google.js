const express     = require('express');
const googleauth = require('../googleauth');
const router      =  new express.Router();
const User        = require('../models/user')

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
        console.log("Authorizing in with access code:" + code);
        const user = await googleauth.handleAccessCode(code, async function(user){
            console.log("User:" + user);
            if(user)
            {
                const token = await user.newAuthToken();
                console.log("Token:" + token);
                res.send({ user, token})
            }
            else
            {
                res.status(400).send() 
            }
        });
    }catch(e){
        res.status(400).send(e)
    }
})
