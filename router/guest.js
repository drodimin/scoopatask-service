const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const utils = require('../utils');
const shortid = require('shortid');
module.exports = router

router.get('/guestlogin', async (req,res) => {
    try{
        //generate id for guest
        const id = shortid.generate();
        const token = await utils.createJWT(id, true);
        console.log("generated guest token for", id);
        res.status(201).send({token});
    }catch(e){
        res.status(400).send(e)
    }
})