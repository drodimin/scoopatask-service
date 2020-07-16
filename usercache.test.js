const UserCache = require('./usercache').UserCache;
const exceptions = require('./exceptions');
const services = require('./services');

let userCache;
const user = {email:'test@test'};
services.driveService = {loadDataFromDrive: jest.fn().mockImplementation(() => Promise.resolve({}))}

describe('getOrCreateUserData', () => {
    beforeEach(() => {
        userCache = new UserCache();
    });

    it('throws exception when user.email is not defined', ()=>{
        expect(() => userCache.getOrCreateUserData({})).toThrow('User email is missing');
    });

    it('return history object if it has been loaded for given user', ()=>{
        userCache.history[user.email] = {};
        const history = userCache.getOrCreateUserData(user);
        expect(history).toBeDefined();
    });

    it('returns load promise if it exists for given user', ()=>{
        const checkValue = 'isPromise';
        userCache.loadPromises[user.email] = {check:checkValue};
        const loadPromise = userCache.getOrCreateUserData(user);
        expect(loadPromise.check).toEqual(checkValue);
    });
});

describe('getOrCreateUserHistoryData', () => {
    beforeEach(() => {
        userCache = new UserCache();
    });

    it('throws exception when user.email is not defined', ()=>{
        expect(() => userCache.getOrCreateUserHistoryData({})).toThrow('User email is missing');
    });

    it('return history object if it has been loaded for given user', ()=>{
        userCache.history[user.email] = {};
        const history = userCache.getOrCreateUserHistoryData(user);
        expect(history).toBeDefined();
    });

    it('returns load promise if it exists for given user', ()=>{
        const checkValue = 'isPromise';
        userCache.historyLoadPromises[user.email] = {check:checkValue};
        const historyPromise = userCache.getOrCreateUserHistoryData(user);
        expect(historyPromise.check).toEqual(checkValue);
    });
});