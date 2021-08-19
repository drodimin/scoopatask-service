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

describe('moveBucketBefore', () => {
  it('throws exception when target bucket is not found', () => {
    const appData = getAppData();
    expect(() => appData.moveBucketBefore('someid1', appData._buckets[0]._id)).toThrow(exceptions.InvalidIdException);
  })

  it('throws exception when destination bucket is not found', () => {
    const appData = getAppData();
    expect(() => appData.moveBucketBefore(appData._buckets[0]._id, 'someid2')).toThrow(exceptions.InvalidIdException);
  })

  it('target bucket gets moved before destination bucket', () => {
    // Arrange
    const appData = new AppData();
    for(let i=0; i<10; i++) {
      appData.addBucket(new Bucket({_id:i.toString()}));
    }
    
    // Act, Assert
    appData.moveBucketBefore('9', '4');
    expect(appData._buckets[4]._id).toEqual('9');
    expect(appData._buckets[5]._id).toEqual('4');
    expect(appData._buckets[9]._id).toEqual('8');

    appData.moveBucketBefore('0', '7');
    expect(appData._buckets[0]._id).toEqual('1');
    expect(appData._buckets[7]._id).toEqual('0');
    expect(appData._buckets[8]._id).toEqual('7');
  })
})