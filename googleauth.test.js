const googleauth = require('googleauth');
describe('SaveDataToDrive', ()=>{
    const filename = 'file1';
    const googleDrive = {};
    
    beforeEach(()=>{
        googleauth.createDriveClient = jest.fn(()=>googleDrive);
    });
    
    if('searches for given file name', ()=>{
        //act
        googleauth.saveDataToDrive({}, {}, file1);
        
    })
})