var util = require('./util')
var ClientComm = require('./clientcomm')

module.exports = Comm


// Local emit function
var debug = util.debug
var emit = util.emit
var send = util.send


// Comm definition
function Comm(socket, opts) {
    if (!(this instanceof Comm))
        return new Comm(socket)

    opts = opts || {}

    var self = this
    var clients = this.clients = {}
    var handles = this.handles = {}
    this.socket = socket

    var fallback = this.fallback = opts.fallback || true


    socket.on('connection',
    handles.open = function(socket) {
        var comm = new ClientComm(socket)
        clients[comm.id] = comm

        socket.on('message', handles.message.bind(null, comm))
        socket.on('close', handles.close.bind(null, comm))

        emit.call(self, 'connect', comm)
    })

    handles.connect = function(comm, info) {
        info.fallback = fallback
        comm.info = info

        for (var id in clients) {
            if (id != comm.id) {
                send.call(clients[id].socket, 'connect', comm.id, info)
                send.call(comm.socket, 'connect', id, clients[id].info)
            }
        }
    }

    handles.message = function(comm, data) {
        debug('recv %s', data)
        var args = JSON.parse(data)
        var handler = handles[args[0]]
        args[0] = comm

        handler.apply(null, args)
    }

    handles['data:server'] = function(comm, args) {
        emit.apply(comm, args)
    }

    handles.data = function(comm, ids, args) {
        var name = 'data:' + comm.id

        for (var i = 0; i < ids.length; i++) {
            send.call(clients[ids[i]].socket, name, args)
        }
    }

    handles.close = function(comm) {
        delete clients[comm.id]

        for (var k in clients)
            send.call(clients[k].socket, 'disconnect', comm.id)
    }

    socket.on('error', emit.bind(this, 'error'))
}


// Inherit from Emitter
Comm.prototype = Object.create(util.Emitter.prototype)


Comm.prototype.emit = function() {
    var clients = this.clients
    var args = Array.prototype.slice.call(arguments)

    for (var k in clients) {
        send.call(clients[k].socket, 'data:server', args)
    }
}
