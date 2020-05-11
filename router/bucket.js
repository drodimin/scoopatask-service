const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const googleauth = require('../googleauth');
const usercache = require('../usercache').cacheInstance;
const exceptions = require('../exceptions');
const appService = require('../appdata/appservice');

module.exports = router;

router.post('/bucket', authenticate, async (req, res) => {
    try {
        console.log("Adding new bucket", req.user);
        const appData = await usercache.getOrCreateUserData(req.user);
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
        const appData = await usercache.getOrCreateUserData(req.user);
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
        const appData = await usercache.getOrCreateUserData(req.user);
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
        const bucketId = req.params['bucketId'];
        const taskId = req.params['taskId'];
        console.log(`Deleting task ${taskId} in bucket ${bucketId}`, req.user);
        
        const appData = await usercache.getOrCreateUserData(req.user);
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

router.put('/bucket/:bucketId/task/:taskId', authenticate, async (req, res) => {
    try {
        console.log("Updating task", req.user);
        const bucketId = req.params['bucketId'];
        const taskId = req.params['taskId'];
        const appData = await usercache.getOrCreateUserData(req.user);
        let task = appData.updateTask(bucketId, taskId, req.body);  
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

router.get('/bucket/:bucketId/task/:taskId/complete', authenticate, async (req, res) => {
    try {
        console.log("Completing task", req.user);
        const bucketId = req.params['bucketId'];
        const taskId = req.params['taskId'];

        const modifiedBucket = appService.completeTask(bucketId, taskId, req.user);  

        if(!req.user.isGuest) {    
            await googleauth.saveDataToDrive(appData, req.user);
            await googleauth.saveHistoryDataToDrive()
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