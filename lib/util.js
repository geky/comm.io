var Emitter = require('events').EventEmitter


// Local event handling functions
module.exports.on = Emitter.prototype.on
module.exports.off = Emitter.prototype.off
module.exports.emit = Emitter.prototype.emit
module.exports.send = function() {
    var data = JSON.stringify(Array.prototype.slice.call(arguments))

    this.log('send', data)
    this.send(data)
}

// EventEmitter class
module.exports.Emitter = Emitter
