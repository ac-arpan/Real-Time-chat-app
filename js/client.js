const socket = io('http://localhost:8000');


//Get the DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// The notification audio
const audio = new Audio('swiftly.mp3');


// Utility function for creating a message DOM node  
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add('animated');
    messageElement.classList.add(position);
    
    // position == 'right' ? messageElement.classList.add('slideInRight') : messageElement.classList.add('slideInLeft');
    if (position == 'right') {
        messageElement.classList.add('slideInRight');
    }
    else {
        messageElement.classList.add('slideInLeft');
    }
    
    messageContainer.appendChild(messageElement);
    if (position === 'left') {
        audio.play();
    }
    
}

//This is a event ,node server will catch and perform the callback function's task
// Ask the new user for his/her name and let the server know that by emiting the 'new-user-join' event
const name = prompt('Enter your name to join : ');
socket.emit('new-user-joined', name);


// Listen the 'user-joined' event from the server and perform the task
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
})


// Listen the 'recieve' event from the server and perform the task by sending the message to others
socket.on('recieve', data => {
    append(`${data.message} : ${data.name} `, 'left');
})

// Listen the 'left' event when a people leave the chat
socket.on('left', name => append(`${name} has left the chat`, 'left'));

// if the form is submitted handle the event and emit the send event
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`${message} : You`, 'right');

    socket.emit('send', message);
    messageInput.value = '';
})