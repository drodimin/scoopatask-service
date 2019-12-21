const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const googleauth = require('../googleauth');

module.exports = router;

router.get('/appdata', authenticate, async (req, res) => {
    try {
        console.log("Get AppData");
        googleauth.loadDataFromDrive(req.user)
        .then(appdata => { res.send(appdata) })
        .catch(err => { res.status(500).send(err) });
    } catch (error) {
        res.status(400).send()        
    }
})