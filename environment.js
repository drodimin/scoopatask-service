const dotenv = require('dotenv');
const dotenv = require('dotenv');

function getDataFileName() {
    let filename = 'data';
    if(process.env.ENVIRONMENT_NAME) {
        filename += '_' + process.env.ENVIRONMENT_NAME;
    }
    return filename + '.json';
}

module.exports = { getDataFileName }