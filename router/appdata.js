const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const usercache = require('../usercache').cacheInstance;
const services = require('../services');

module.exports = router;

router.get('/appdata', authenticate, async (req, res) => {
    try {
        console.log("Get AppData");
        const data = await usercache.getOrCreateUserData(req.user);
        res.send(data);
    } catch (error) {
        console.log(error);
        if(error.code === 403 ) {
            res.status(403).send(error);
        }
        else{
            res.status(400).send(error);
        }        
    }
})

router.get('/history', authenticate, async (req, res) => {
    try {
        console.log("Get History");
        const data = await usercache.getOrCreateUserHistory(req.user);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(400).send(error)        
    }
})

router.post('/appdata', authenticate, async(req, res) => {
    try {
        console.log("Updating appdata", req.user);
        
        await services.driveService.saveDataToDrive(req.body, req.user);
        const newData = await services.driveService.loadDataFromDrive(req.user);
        usercache.updateUserData(req.user, newData)
        res.send(newData);  
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})