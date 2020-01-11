const shortid = require('shortid');
const exceptions = require('./exceptions');

module.exports = class AppData {
  constructor(obj) {
      this._buckets = [];
      if(obj) {
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
    bucket.delete(taskId);
    return bucket;
  }
}

class Bucket {
  constructor(obj) {
    this._id = shortid.generate();
    this.created = Date.now;
    this.updated = Date.now;
    this._tasks = [];
    obj && Object.assign(this, obj);
  }

  add(task) {
    task._id = shortid.generate();
    task.created = Date.now;
    task.updated = Date.now;
    this._tasks.push(task);
  }

  delete(taskId) {
    const task = this._tasks.find(task => task._id === taskId);
    if(!task) {
      throw new exceptions.InvalidIdException(`Task with id ${taskId} doesn't exist`);
    }
    this._tasks = this._tasks.filter(task => task._id !== taskId);
    return task;
  }
}