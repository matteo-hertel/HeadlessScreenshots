/* jshint node:true */
/* jshint esnext:true */
var eventEmitter;
var exports = module.exports = {};
exports.setEmitter = function(emitter) {
    eventEmitter = emitter;
};
exports.screenshot = function(url, output, dimensions) {
    var path = require('path');
    var childProcess = require('child_process');
    var phantomjs = require('phantomjs');
    var binPath = phantomjs.path;

    var childArgs = [
        path.join(__dirname, './handlers/screenshot.js'),
        url,
        output,
        dimensions
    ];

    childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        if (!eventEmitter) {
            return;
        }
        if (err) {
            eventEmitter.emit("error", {
                key: dimensions.replace(/\*/g, ""),
                status: "error",
                message: err
            });
        }
        if (stdout) {
            eventEmitter.emit("success", {
                key: dimensions.replace(/\*/g, ""),
                status: "success",
                message: stdout
            });
        }
        if (stderr) {
            eventEmitter.emit("stderror", {
                key: dimensions.replace(/\*/g, ""),
                status: "stderror",
                message: stderr
            });
        }
    });
};
