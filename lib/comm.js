var util = require('./util')

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

    var clients = this.clients = {}
    var handles = this.handles = {}
    this.socket = socket

    var fallback = this.fallback = opts.fallback || true


    socket.on('connection',
    handles.open = function(comm) {
        clients[comm.id] = comm

        comm.on('message', handles.message.bind(null, comm))
        comm.on('close', handles.close.bind(null, comm))
    })

    handles.connect = function(comm, info) {
        info.fallback = fallback
        comm.info = info

        for (var id in clients) {
            if (id != comm.id) {
                send.call(clients[id], 'connect', comm.id, info)
                send.call(comm, 'connect', id, clients[id].info)
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

    handles.data = function(comm, vol, ids, args) {
        var name = 'data:' + comm.id

        for (var i = 0; i < ids.length; i++) {
            send.call(clients[ids[i]], name, args)
        }
    }

    handles.close = function(comm) {
        delete clients[comm.id]

        for (var k in clients)
            send.call(clients[k], 'disconnect', comm.id)
    }

    socket.on('error', emit.bind(this, 'error'))
}


// Inherit from Emitter
Comm.prototype = Object.create(util.Emitter.prototype)
