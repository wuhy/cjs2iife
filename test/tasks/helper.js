var fs = require('fs');
var path = require('path');

exports.readFile = function (fileName) {
    return fs.readFileSync(path.join(__dirname, '..', 'fixtures', fileName)).toString();
};
