function InvalidIdException(message) {this.message = message;}
function MongoDbException(message) {this.message = message;}
function InvalidArgumentException(message) {this.message = message;}
function ArgumentNullException(message) {this.message = message;}
function ArgumentException(message) {this.message = message;}

module.exports = {InvalidIdException, MongoDbException, InvalidArgumentException, ArgumentNullException, ArgumentException } 