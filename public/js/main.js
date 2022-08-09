
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name') 
const userList = document.getElementById('users')

//get username and room from url
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})


const socket = io()

//join Chat Room
socket.emit('joinRoom', {username, room})

//get room and users
socket.on('roomUsers', ({room, users})=>{
    outputRoomName(room);
    outputUsers(users);
})


socket.on('message', (msg) => {
    outputMessage (msg);


    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})


//added msg
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value
    socket.emit('chatMessage', msg)
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})


//adding info to dom
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    chatMessages.appendChild(div)
}


//Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room
}


//Add users
function outputUsers(users){
    console.log('pre',userList)
    userList.innerHTML = `${users.map( user => `<li> ${user.username}</li>`).join('')}`
    console.log('post',userList)
}
