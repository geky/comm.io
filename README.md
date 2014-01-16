# comm.io #

layer for direct browser-to-browser communication over Engine.IO and WebRTC.

## Example Usage ##

The following example creates a simple chat program in the console.

```js
var comm = cio()

comm.on('connect', function(comm) {
    comm.on('chat', function(data) {
        console.log('>', data)
    })
})

function send(data) {
    comm.emit('chat', data)
}
```

All that is required on the server side is a hook into an http server

```js
var server = require('http').Server()
var comm = require('comm.io').attach(server)

server.listen(3000)
```
