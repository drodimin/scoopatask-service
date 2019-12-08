const appData = require('../AppData');
const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const googleauth = require('../googleauth');

module.exports = router;

router.post('/bucket', authenticate, async (req, res) => {
    try {
        let newBucket = appData.addBucket(req.body);        
        googleauth.saveToDrive(appData, req.user)
        .then(res.send(newBucket))
        .catch(res.status(500).send());
    } catch (error) {
        res.status(400).send()        
    }
})