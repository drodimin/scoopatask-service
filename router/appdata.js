const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const usercache = require('../usercache');

module.exports = router;

router.get('/appdata', authenticate, async (req, res) => {
    try {
        console.log("Get AppData");
        const data = await usercache.getOrCreate(req.user.email);
        res.send(data);
    } catch (error) {
        res.status(400).send()        
    }
})