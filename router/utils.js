const express     = require('express');
const router      =  new express.Router();
const authenticate  = require('../auth_middleware');
const googleauth = require('../googleauth');

module.exports = router;

router.get('/files', authenticate, async (req, res) => {
    try {     
        googleauth.listFiles(req.user)
        .then(files => {

            console.log(files);
            res.send(files);
        })
        .catch((err) => {
            console.log("Failed to list files", err);
            res.status(500).send();
        });
    } catch (error) {
        console.log(error);
        res.status(400).send()        
    }
})

router.get('/file/:filename', authenticate, async (req, res) => {
    try {    
        let filename = req.params['filename'];
        let client = googleauth.createAuthClient();
        client.setCredentials(req.user.google);
        googleauth.find(client, filename)
        .then(file => {
            console.log(file);
            res.send(file);
        })
        .catch((err) => {
            console.log("Failed to find file", err);
            res.status(500).send();
        });
    } catch (error) {
        console.log(error);
        res.status(400).send()        
    }
})

router.get('/filedata/:fileid', authenticate, async (req, res) => {
    try {    
        const fileid = req.params['fileid'];
        const drive = googleauth.createDriveClient(req.user.google);

        googleauth.get(drive, fileid)
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch((err) => {
            console.log("Failed to get file data", err);
            res.status(500).send();
        });
    } catch (error) {
        console.log(error);
        res.status(400).send()        
    }
})

router.delete('/filedata/:fileid', authenticate, async (req, res) => {
    try {    
        const fileid = req.params['fileid'];
        const drive = googleauth.createDriveClient(req.user.google);

        googleauth.delete(drive, fileid)
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch((err) => {
            console.log("Failed to delete file", err);
            res.status(500).send();
        });
    } catch (error) {
        console.log(error);
        res.status(400).send()        
    }
})