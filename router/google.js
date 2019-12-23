const express     = require('express');
const googleauth = require('../googleauth');
const router      =  new express.Router();
const User        = require('../models/user')
const utils       = require('../utils')

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
        console.log("Authorizing with access code:" + code);
        const user = await googleauth.handleAccessCode(code, async function(user){
            console.log("User", user);
            if(user)
            {
                const token =await User.newAuthToken(user);
                console.log("Token:" + token);
                res.send({ emai:user.email, token:token})
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
