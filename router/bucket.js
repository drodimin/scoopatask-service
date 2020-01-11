const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const googleauth = require('../googleauth');
const usercache = require('../usercache');
const exceptions = require('../exceptions');

module.exports = router;

router.post('/bucket', authenticate, async (req, res) => {
    try {
        console.log("Adding new bucket", req.user);
        const appData = await usercache.getOrCreate(req.user);
        const newBucket = appData.addBucket(req.body);  
        if(!req.user.isGuest) {    
            await googleauth.saveDataToDrive(appData, req.user);
        }  
        res.send(newBucket);       
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.delete('/bucket/:bucketId', authenticate, async (req, res) => {
    try {
        console.log("Deleting a bucket", req.user);
        const bucketId = req.params['bucketId'];
        const appData = await usercache.getOrCreate(req.user);
        appData.deleteBucket(bucketId);  
        if(!req.user.isGuest) {    
            await googleauth.saveDataToDrive(appData, req.user);
        }   
        res.status(204).send();      
    } catch (error) {
        console.log(error);
        if (error instanceof exceptions.InvalidIdException) {
            res.status(400).send();
        }
        else {
            res.status(500).send();
        }
    }
})

router.post('/bucket/:bucketId/task', authenticate, async (req, res) => {
    try {
        console.log("Adding new task", req.user);
        const bucketId = req.params['bucketId'];
        const appData = await usercache.getOrCreate(req.user);
        const bucket = appData.addTask(bucketId, req.body);  
        if(!req.user.isGuest) {    
            await googleauth.saveDataToDrive(appData, req.user);
        }   
        res.send(bucket);      
    } catch (error) {
        console.log(error);
        if (error instanceof exceptions.InvalidIdException) {
            res.status(400).send();
        }
        else {
            res.status(500).send();
        }
    }
});

router.delete('/bucket/:bucketId/task/:taskId', authenticate, async (req, res) => {
    try {
        console.log("Deleting new task", req.user);
        const bucketId = req.params['bucketId'];
        const taskId = req.params['taskId'];
        const appData = await usercache.getOrCreate(req.user);
        let task = appData.deleteTask(bucketId, taskId);  
        if(!req.user.isGuest) {    
            await googleauth.saveDataToDrive(appData, req.user);
        }  
        res.send(task);
    } catch (error) {
        console.log(error);
        if (error instanceof exceptions.InvalidIdException) {
            res.status(400).send();
        }
        else {
            res.status(500).send();
        }
    }
})