const {google} = require('googleapis');

class DriveAppDataClient {    
    gDrive(gAuthClient,verbose=false){
        this._verbose = verbose;
        _drive = google.drive({version: 'v3', auth: gAuthClient});
    }
    _drive;
    _verbose;

    log(){
        if(verbose){
            console.log(arguments);
        }
    }

    find(filename){
        log("Find file", filename);
        return new Promise((resolve, reject) => {            
            drive.files.list({
                q: "name='" + filename + "'",
                spaces: 'appDataFolder',
                fields: 'nextPageToken, files(id, name)',
            }, function (err, res) {
                if (err) {
                    console.log("Drive error", err);
                    reject(err);
                } else {
                    console.log("Found");
                    resolve(res.data.files);
                }
            });
        });
    }
}