const appService = require('./appservice');
const userCache = require('../usercache');
const AppData = require('./appdata');
const HistoryData = require('./historydata');
const Bucket = require('./bucket');
const services = require('../services');

describe('completeTask', () => {
    const taskId = 't';
    const bucketId = 'b';
    const bucket = new Bucket({_id: bucketId,_tasks:[{_id:taskId}]});

    const user = {email:'abc'};
    const appData = new AppData();
    const historyData = new HistoryData();

    const mockDriveService = { saveDataToDrive: jest.fn(), saveHistoryDataToDrive: jest.fn()}
    services.driveService = mockDriveService;
    
    beforeEach(()=>{
        userCache.getOrCreateUserData = jest.fn(()=>appData);
        userCache.getOrCreateUserHistoryData = jest.fn(()=>historyData);
        appData.completeTask = jest.fn(()=>bucket);
        historyData.addBucket = jest.fn(()=>bucket);
    })

    it('gets user data on the cache', async()=>{
        //act
        await appService.completeTask('a', 'b', user);
        //assert
        expect(userCache.getOrCreateUserData).toHaveBeenCalledWith(user);
        expect(userCache.getOrCreateUserData).toHaveBeenCalledTimes(1);
    })

    it('gets user history data on the cache', async()=>{
        //act
        await appService.completeTask('a', 'b', user);
        //assert
        expect(userCache.getOrCreateUserHistoryData).toHaveBeenCalledWith(user);
        expect(userCache.getOrCreateUserHistoryData).toHaveBeenCalledTimes(1);
    })

    it('calls completeTask on user data passing bucketId and taskId and passes result to history data addBucket', async()=>{
        //act
        await appService.completeTask(bucketId, taskId, user);
        //assert
        expect(appData.completeTask).toHaveBeenCalledWith(bucketId, taskId);
        expect(appData.completeTask).toHaveBeenCalledTimes(1);

        expect(historyData.addBucket).toHaveBeenCalledWith(bucket);
        expect(historyData.addBucket).toHaveBeenCalledTimes(1);
    })

    it('returns the result of historyData.addBucket', async()=>{
        //act
        let result = await appService.completeTask(bucketId, taskId, user);
        //assert
        expect(result).toEqual(bucket);
    })

    it('saves user data and history data if user is not Guest', async()=>{
        //act
        let result = await appService.completeTask(bucketId, taskId, user);
        //assert
        expect(mockDriveService.saveDataToDrive).toHaveBeenCalledWith(appData, user);
        expect(mockDriveService.saveHistoryDataToDrive).toHaveBeenCalledWith(historyData, user);
    })

    it('does not save user data and history data if user is Guest', async()=>{
        // Arrange
        user.isGuest = true;

        //act
        let result = await appService.completeTask(bucketId, taskId, user);

        //assert
        expect(mockDriveService.saveDataToDrive).not.toHaveBeenCalled();
        expect(mockDriveService.saveHistoryDataToDrive).not.toHaveBeenCalled();
    })
})