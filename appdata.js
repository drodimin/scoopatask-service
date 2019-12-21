const shortid = require('shortid');

module.exports = class AppData {
  
  constructor() {
      this._buckets = [];
  }
  
  addBucket(bucket){
    bucket._id = shortid.generate();
    bucket.created = Date.now;
    bucket.updated = Date.now;
    this._buckets.push(bucket);
    return bucket;
  }
}
