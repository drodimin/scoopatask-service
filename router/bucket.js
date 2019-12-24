const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const googleauth = require('../googleauth');
const usercache = require('../usercache');

module.exports = router;

router.post('/bucket', authenticate, async (req, res) => {
    try {
        console.log("Adding new bucket", req.user);
        const appData = await usercache.getOrCreate(req.user.email);
        console.log("AppData", appData);
        let newBucket = appData.addBucket(req.body);  
        if(req.user.isGuest) {    
            res.send(newBucket);
        } else {
            googleauth.saveDataToDrive(appData, req.user)
            .then((file) => {
                console.log("Returning new bucket");
                res.send(newBucket);
            })
            .catch((err) => { 
                console.log("Save data failed", err);
                res.status(500).send() 
            });
        }        
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
})