const appService = require('./appservice');
const userCache = require('../usercache').cacheInstance;
const AppData = require('./appdata');
const HistoryData = require('./historydata');
const Bucket = require('./bucket');
const services = require('../services');
const exceptions = require('../exceptions');

const user = {email:'abc'};
const appData = new AppData();

describe('completeTask', () => {
    const taskId = 't';
    const bucketId = 'b';
    const bucket = new Bucket({_id: bucketId,_tasks:[{_id:taskId}]});
    const modifiedBucket = new Bucket({_id: bucketId,_tasks:[]});

    const historyData = new HistoryData();

    const mockDriveService = { saveDataToDrive: jest.fn(), saveHistoryToDrive: jest.fn()}
    services.driveService = mockDriveService;
    
    beforeEach(()=>{
        userCache.getOrCreateUserData = jest.fn(()=>Promise.resolve(appData));
        userCache.getOrCreateUserHistory = jest.fn(()=>historyData);
        appData.completeTask = jest.fn(()=>{ return { historyBucket: bucket, modifiedBucket: modifiedBucket };});
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
        expect(userCache.getOrCreateUserHistory).toHaveBeenCalledWith(user);
        expect(userCache.getOrCreateUserHistory).toHaveBeenCalledTimes(1);
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

    it('returns modified bucket', async()=>{
        //act
        let result = await appService.completeTask(bucketId, taskId, user);
        //assert
        expect(result).toEqual(modifiedBucket);
    })

    it('saves user data and history data if user is not Guest', async()=>{
        //act
        await appService.completeTask(bucketId, taskId, user);
        //assert
        expect(mockDriveService.saveDataToDrive).toHaveBeenCalledWith(appData, user);
        expect(mockDriveService.saveHistoryToDrive).toHaveBeenCalledWith(historyData, user);
    })

    it('does not save user data and history data if user is Guest', async()=>{
        // Arrange
        user.isGuest = true;

        //act
        await appService.completeTask(bucketId, taskId, user);

        //assert
        expect(mockDriveService.saveDataToDrive).not.toHaveBeenCalled();
        expect(mockDriveService.saveHistoryToDrive).not.toHaveBeenCalled();
    })
});

describe('moveBucketBefore', () => {
    const targetBucketId = 'a';
    const destBucketId = 'b'

    beforeEach(()=>{
        appData.moveBucketBefore = jest.fn();
    })

    it('throws exception if user object is not passed', () => {
        expect(() => appService.moveBucketBefore('a', 'b')).rejects.toThrowError('user');
    });

    it('calls moveBucketBefore on user data passing target and destination bucket Ids', async()=>{
        //act
        await appService.moveBucketBefore(targetBucketId, destBucketId, user);

        //assert
        expect(appData.moveBucketBefore).toHaveBeenCalledWith(targetBucketId, destBucketId);
        expect(appData.moveBucketBefore).toHaveBeenCalledTimes(1);
    })
})