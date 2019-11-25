const appData = require('../AppData');
const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const googleauth = require('../googleauth');

module.exports = router;

router.post('/bucket', authenticate, async (req, res) => {
    try {
        let newBucket = appData.addBucket(req.body);
        res.send(newBucket);
        googleauth.saveToDrive(appData, req.user);
    } catch (error) {
        res.status(400).send()        
    }
})