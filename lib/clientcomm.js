var util = require('./util')

module.exports = ClientComm


// Local event handling functions
var emit = util.emit
var send = util.send


// ClientComm definition
function ClientComm(socket) {
    if (!(this instanceof ClientComm))
        return new ClientComm(socket)

    this.socket = socket
    this.id = socket.id
}


// Extend Emitter
ClientComm.prototype = Object.create(util.Emitter.prototype)


// Public functions for transmitting data to a single client
ClientComm.prototype.emit = function() {
    send.call(this.socket, 'data:server',
        Array.prototype.slice.call(arguments))
}

ClientComm.prototype.vemit = function() {
    send.call(this.socket, 'data:server',
        Array.prototype.slice.call(arguments))
}
