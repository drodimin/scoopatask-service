const usercache = require('../usercache').cacheInstance;
const services = require('../services');
const exceptions = require('../exceptions');

async function completeTask(bucketId, taskId, user) {
    const appData = await usercache.getOrCreateUserData(user);
    const historyData = await usercache.getOrCreateUserHistory(user);
    const result = appData.completeTask(bucketId, taskId); 
    historyData.addBucket(result.historyBucket);
    if(!user.isGuest) {
        await services.driveService.saveDataToDrive(appData, user);
        await services.driveService.saveHistoryToDrive(historyData, user);
    }
    return result.modifiedBucket 
}

async function moveBucketBefore(targetBucketId, destBucketId, user) {
    if(!user) {
        throw new exceptions.ArgumentNullException('user')
    }
    const appData = await usercache.getOrCreateUserData(user);
    appData.moveBucketBefore(targetBucketId, destBucketId);
}

module.exports = { completeTask, moveBucketBefore }