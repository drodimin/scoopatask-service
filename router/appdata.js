const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const usercache = require('../usercache').cacheInstance;

module.exports = router;

router.get('/appdata', authenticate, async (req, res) => {
    try {
        console.log("Get AppData");
        const data = await usercache.getOrCreateUserData(req.user);
        res.send(data);
    } catch (error) {
        res.status(400).send()        
    }
})

router.get('/history', authenticate, async (req, res) => {
    try {
        console.log("Get History");
        const data = await usercache.getOrCreateUserHistory(req.user);
        res.send(data);
    } catch (error) {
        res.status(400).send()        
    }
})