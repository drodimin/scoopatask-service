const shortid = require('shortid');

module.exports = class AppData {
  
  constructor(obj) {
      this._buckets = [];
      obj && Object.assign(this, obj);
  }
  
  addBucket(bucket){
    bucket._id = shortid.generate();
    bucket.created = Date.now;
    bucket.updated = Date.now;
    this._buckets.push(bucket);
    return bucket;
  }
}
