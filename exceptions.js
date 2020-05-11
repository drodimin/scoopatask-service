function InvalidIdException(message) {this.message = message;}
function MongoDbException(message) {this.message = message;}
function InvalidArgumentException(message) {this.message = message;}

module.exports = {InvalidIdException, MongoDbException, InvalidArgumentException } 