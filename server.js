const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require ('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const bot = 'ChatBot'

app.use(express.static(path.join(__dirname, "public")))

io.on('connection', socket =>{

    socket.on('joinRoom', ({username, room})=>{
        const user= userJoin(socket.id, username, room)
        socket.join(user.room)


        //welcome
        socket.emit('message', formatMessage(bot, `Welcome to the chat!`))
 

        //when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} has joined the chat`))
        
        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    
    //when sb send a message
    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
    
    //when user disconnects
    socket.on('disconnect', () =>{
        const user= userLeave(socket.id)
        if (user){
        io
        .to(user.room)
        .emit('message', formatMessage(bot, `${user.username} has left the chat`))

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    }
})
})

server.listen(3001, ()=> console.log('listening on port 3001'))


