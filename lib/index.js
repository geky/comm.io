var io = require('engine.io')
var Comm = require('./comm')

module.exports = attach
module.exports.attach = attach
module.exports.listen = listen

// Creates comm on an http server
function attach(server, opts) {
    var socket = io.attach(server, opts)

    return new Comm(socket, opts)
}

// Creates comm on a port
function listen(port, opts, cb) {
    if (typeof opts == 'function') {
        cb = opts
        opts = {}
    }

    var socket = io.listen(port, opts, cb)

    return new Comm(socket, opts)
}
