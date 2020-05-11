const usercache = require('../usercache');
const googleauth = require('../googleauth');

async function completeTask(bucketId, taskId, user) {
    const appData = await usercache.getOrCreateUserData(user);
    const historyData = await usercache.getOrCreateUserHistoryData(user);
    const completedBucket = appData.completeTask(bucketId, taskId); 
    const historyBucket = historyData.addBucket(completedBucket);
    await googleauth.saveDataToDrive(appData, user);
    await googleauth.saveHistoryDataToDrive(historyData, user);
    return historyBucket;
}

module.exports = { completeTask: completeTask }