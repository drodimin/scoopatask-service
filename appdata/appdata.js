const shortid = require('shortid');
const exceptions = require('../exceptions');
const Bucket = require('./bucket');
const utils = require('../utils');

module.exports = class AppData {
  constructor(obj) {
      this._buckets = [];
      if(obj && obj._buckets) {
        obj._buckets.forEach(bucket => {
          const newBucket = new Bucket(bucket);
          this._buckets.push(newBucket);
        });
      }
      console.log('new app data', this);
  }
  
  addBucket(bucket) {
    const newBucket = new Bucket(bucket);
    this._buckets.push(newBucket);
    return newBucket;
  }

  deleteBucket(bucketId, taskId) {
    const bucket = this._buckets.find(bucket => bucket._id === bucketId);
    if(!bucket) {
      throw new exceptions.InvalidIdException(`Bucket with id ${bucketId} doesn't exist`);
    }
    console.log('deleting task in bucket', bucket)
    this._buckets = this._buckets.filter(bucket => bucket._id !== bucketId);
    return bucket;
  }

  addTask(bucketId, task) {
    const bucket = this._buckets.find(bucket => bucket._id === bucketId);
    if(!bucket) {
      throw new Error(`Bucket ${bucketId} not found`);
    }
    bucket.add(task);
    return bucket;
  }

  deleteTask(bucketId, taskId) {
    const bucket = this._buckets.find(bucket => bucket._id === bucketId);
    if(!bucket) {
      throw new exceptions.InvalidIdException(`Bucket with id ${bucketId} doesn't exist`);
    }
    console.log('deleting task in bucket', bucket)
    bucket.deleteTask(taskId);
    return bucket;
  }

  updateTask(bucketId, taskId, task) {    
    const bucket = this._buckets.find(bucket => bucket._id === bucketId);
    if(!bucket) {
      throw new exceptions.InvalidIdException(`Bucket with id ${bucketId} doesn't exist`);
    }
    console.log('updating task in bucket', bucket._id)
    bucket.updateTask(taskId, task);
    return bucket;
  }

  completeTask(bucketId, taskId) {
    const bucket = this._buckets.find(bucket => bucket._id === bucketId);
    if(!bucket) {
      throw new exceptions.InvalidIdException(`Bucket with id ${bucketId} doesn't exist`);
    }
    console.log('completing task in bucket', bucket._id);
    const completedTask = bucket.completeTask(taskId);
    completedTask.completedDate = new Date();
    const historyBucket = utils.pick(bucket, ['_id','name']);
    historyBucket._tasks = [completedTask];
    return { historyBucket: historyBucket, modifiedBucket: bucket };
  }
}