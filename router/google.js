const express     = require('express');
const googleauth = require('../googleauth');
const router      =  new express.Router();
const User        = require('../models/user');
const utils       = require('../utils');
const usercache = require('../usercache').cacheInstance;

module.exports = router

router.get('/googleurl', async (req, res) => {
    try{
        const url = await googleauth.createUrl();
        res.status(201).send(url)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/googlecode', async (req, res) => {
    try{
        const code = req.query.code;
        console.log("Authorizing with access code:" + code);
        const user = await googleauth.signInUserWithAccessCode(code);
        if(user)
        {
            console.log(`User ${user.email} signed in`);
            const token = await User.createToken(user);
            console.log("New application token:" + token);

            //start loading user data asyncronously
            usercache.getOrCreateUserData(user);
            res.send({ emai:user.email, token:token})
        }
        else
        {
            res.status(400).send() 
        }
    }catch(e){
        console.log(e);
        res.status(500).send(e)
    }
})
