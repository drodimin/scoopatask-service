const HistoryData = require('./historydata');
const existingBucketId = 'existingBucketId';
const existingBucketName = 'existingBucketName';

describe('addBucket', () => {
    let historyData; 
    beforeEach(() => {
        historyData= new HistoryData({_buckets:[{_id:existingBucketId, 
            name:existingBucketName, _tasks:[{_id:'existingTaskId'}]}]});
    });

    it('if given bucket id not found it is added to the end of list of buckets', ()=> {
        const newBucket = {_id:'newBucket1',_tasks:[{_id:'newTaskId1'}]};
        historyData.addBucket(newBucket);
        expect(historyData._buckets).toHaveLength(2);
        expect(historyData._buckets[1]).toEqual(newBucket);
    });

    it('if given bucket id is found tasks from new bucket are added to the tasks of existing bucket', ()=> {
        const newTask = {_id:'newTaskId1'};
        const newBucket = {_id:existingBucketId,_tasks:[newTask]};
        historyData.addBucket(newBucket);
        expect(historyData._buckets).toHaveLength(1);
        expect(historyData._buckets[0]._tasks).toHaveLength(2);
        expect(historyData._buckets[0]._tasks[1]).toEqual(newTask);
    });

    it('if given bucket id is found and has new name, the name of the existing bucket is replaced and old name added to oldnames', ()=> {
        const newBucketName = 'NewBucketName';
        const newBucket = {_id:existingBucketId,name:newBucketName};
        historyData.addBucket(newBucket);
        expect(historyData._buckets[0].name).toEqual(newBucketName);
        expect(historyData._buckets[0].oldNames).toContain(existingBucketName);
    });
});