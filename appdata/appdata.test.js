const AppData = require('./appdata');
const Bucket = require('./bucket');
const exceptions = require('../exceptions');
const expectext = require('../jest/expect.extend');

const taskId1 = 'azn4';
const bucketId1 = 'anb9';

const updateTaskMock = jest.fn();
const completeTaskMock = jest.fn(taskId => {return {_id:taskId1};});

function getAppData() {
  const bucket = new Bucket({_id: bucketId1,_tasks:[{_id:taskId1}]});
  return new AppData({_buckets: [bucket]}); 
}

describe('updateTask', () => {
  it('throws exception when bucket not found', () => {
    expect(() => getAppData().updateTask('someid', taskId1, {})).toThrow(exceptions.InvalidIdExceptions);
  });

  it('updateTask calls updateTask method of Bucket', () => {
    //arrange
    const appData = getAppData();
    appData._buckets[0].updateTask = updateTaskMock;

    //act
    appData.updateTask(bucketId1, taskId1, {});

    expect(updateTaskMock).toHaveBeenCalledWith(taskId1, {});
    expect(updateTaskMock).toHaveBeenCalledTimes(1);
  });
});

describe('completeTask', () => {
  it('throws exception when bucket not found', () => {
    expect(() => getAppData().completeTask('someid', taskId1, {})).toThrow(exceptions.InvalidIdExceptions);
  });

  it('completeTask calls completeTask on Bucket', () => {
    //arrange
    const appData = getAppData();
    appData._buckets[0].completeTask = completeTaskMock;

    //act
    appData.completeTask(bucketId1, taskId1);

    //assert
    expect( completeTaskMock).toHaveBeenCalledWith(taskId1);
    expect( completeTaskMock).toHaveBeenCalledTimes(1);
  });

  if('returns an object containing completed(a bucket copy with completed task) and the modified bucket') {
    const result = getAppData().completeTask(bucketId1, taskId1);
    expect(result.historyBucket._id).toEqual(bucketId1);
    expect(result.historyBucket._tasks).toHaveLength(1);
    expect(result.historyBucket._tasks[0]._id).toEqual(taskId1);
    expect(result.historyBucket._tasks[0].completedDate).toBeInstanceOf(Date);

    expect(result.modifiedBucket._id).toEqual(bucketId1);
    expect(result.modifiedBucket._tasks).toHaveLength(0);
  }
});