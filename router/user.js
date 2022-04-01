const express     = require('express');
const router      =  new express.Router()
const User        = require('../models/user')
const {ObjectID}  = require('mongodb')

const authenticate  = require('../auth_middleware');
module.exports = router


router.get('/users/me', authenticate ,async (req,res)=> {   
    res.send(req.user)
 })


router.get('/users/logout', authenticate, async (req, res) => {
    try {
        await User.removeToken(req.user, req.token);
        res.send()
    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).send()
    }
})