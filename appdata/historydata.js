const Bucket = require('./bucket');
const utils = require('../utils');

module.exports = class HistoryData {
  constructor(obj) {
      this._buckets = [];
      if(obj && obj._buckets) {
        obj._buckets.forEach(bucket => {
          const newBucket = new Bucket(bucket);
          this._buckets.push(newBucket);
        });
      }
      console.log('new history data', this);
  }

  addBucket(newBucket) {
      const existingBucket = this._buckets.find(b => b._id === newBucket._id);
      if(existingBucket) {
        existingBucket._tasks = existingBucket._tasks.concat(newBucket._tasks);
        if(existingBucket.name !== newBucket.name) {
            if(!existingBucket.oldNames) {
                existingBucket.oldNames = [];
            }
            existingBucket.oldNames.push(existingBucket.name);
            existingBucket.name = newBucket.name;
            return existingBucket;
        }
      } else {
          this._buckets.push(newBucket);
          return newBucket;
      }
  }
}