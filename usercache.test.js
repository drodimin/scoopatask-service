const UserCache = require('./usercache').UserCache;
const exceptions = require('./exceptions');
const services = require('./services');

let userCache;
const user = {email:'test@test'};
let mockLoadDataFromDrive = jest.fn();
let mockLoadHistoryFromDrive = jest.fn();
services.driveService = {loadDataFromDrive: mockLoadDataFromDrive, loadHistoryFromDrive: mockLoadHistoryFromDrive};

const taskId1 = 'azn4';
const bucketId1 = 'anb9';
const bucket = {_id: bucketId1,_tasks:[{_id:taskId1}]};
const appData = {_buckets: [bucket]}; 
const history = {_buckets: [bucket]}; 

describe('getOrCreateUserData', () => {
    beforeEach(() => {
        userCache = new UserCache();
    });

    it('throws exception when user.email is not defined', ()=>{
        expect(() => userCache.getOrCreateUserData({})).toThrow('User email is missing');
    });

    it('returns appdata resolved promise if it exists for given user', async()=>{
        userCache[user.email] = Promise.resolve(appData);
        const result = await userCache.getOrCreateUserData(user);
        expect(result._buckets[0]._id).toEqual(bucketId1);
    });

    it('starts loading appdata for given user if it does not exist in cache', async()=>{
        mockLoadDataFromDrive.mockImplementation(() => Promise.resolve(appData));
        
        const result = await userCache.getOrCreateUserData(user);
        expect(result._buckets[0]._id).toEqual(bucketId1);
        expect(mockLoadDataFromDrive).toHaveBeenCalledTimes(1);
    });
});

describe('getOrCreateUserHistory', () => {
    beforeEach(() => {
        userCache = new UserCache();
    });

    it('throws exception when user.email is not defined', ()=>{
        expect(() => userCache.getOrCreateUserHistory({})).toThrow('User email is missing');
    });

    it('return history resolved if it has been loaded for given user', async()=>{
        userCache.history[user.email] = Promise.resolve(history);
        const result = await userCache.getOrCreateUserHistory(user);
        expect(result._buckets[0]._id).toEqual(bucketId1);
    });

    it('starts loading history data for given user if it does not exist in cache', async()=>{
        mockLoadHistoryFromDrive.mockImplementation(() => Promise.resolve(history));
        
        const result = await userCache.getOrCreateUserHistory(user);

        expect(result._buckets[0]._id).toEqual(bucketId1);
        expect(mockLoadHistoryFromDrive).toHaveBeenCalledTimes(1);
    });
});

describe('updateUserData', () => {
    beforeEach(() => {
        userCache = new UserCache();
    });

    it('throws exception when user.email is not defined', ()=>{
        expect(() => userCache.updateUserData({}, {})).toThrow('User email is missing');
    });

    it('throws exception when data is not defined', ()=>{
        expect(() => userCache.updateUserData({email:'test'}, undefined)).toThrow('User data is not defined');
    });

    it('assigns data to given user', ()=>{
        // Arrange
        const user = {email: 'test'};
        const data = {x: 1};

        // Act
        userCache.updateUserData(user, data);

        // Assert
        expect(userCache[user.email]).toEqual(data);
    })
});