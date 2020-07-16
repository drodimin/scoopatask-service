const usercache = require('../usercache');
const services = require('../services');

async function completeTask(bucketId, taskId, user) {
    const appData = await usercache.getOrCreateUserData(user);
    const historyData = await usercache.getOrCreateUserHistoryData(user);
    const completedBucket = appData.completeTask(bucketId, taskId); 
    const historyBucket = historyData.addBucket(completedBucket);
    if(!user.isGuest) {
        await services.driveService.saveDataToDrive(appData, user);
        await services.driveService.saveHistoryDataToDrive(historyData, user);
    }
    return historyBucket;
}

module.exports = { completeTask: completeTask }