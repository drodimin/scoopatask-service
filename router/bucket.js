const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const googleauth = require('../googleauth');
const usercache = require('../usercache');

module.exports = router;

router.post('/bucket', authenticate, async (req, res) => {
    try {
        console.log("Adding new bucket", req.user);
        const appData = usercache.getOrCreate(req.user.email);
        let newBucket = appData.addBucket(req.body);  
        if(req.user.isGuest) {    
            res.send(newBucket);
        } else {
            googleauth.saveDataToDrive(appData, req.user)
            .then(res.send(newBucket))
            .catch(res.status(500).send());
        }        
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
})