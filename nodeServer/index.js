// Node server which will handle socket.io // client server will connect to this server
const io = require('socket.io')(8000);

const users = {};

// **********Explanation*********
// 'new-user-joined' --> it is a event.If socket listens this event,it will run the callback given to it
// after a new user's joining we are gonna update the users object with a socket id(unique for each connected user)
// with that we are gonna let the other persons(who had also joined the chat) know that a new user has joined
// 'user-joined' ---> it is that event; socket.broadcast.emit() will let the others people know except the user himself

// similarly 'send' --> it is also a event;if it is heard by socket it will run the callback and with that
// it will send the message to the other persons with the help of the 'recieve' event

io.on('connection', socket => {

    // If any new user joins let other user connected to the server know
    socket.on('new-user-joined', name => {
        users[socket.id] =  name;
        // console.log(users);
        socket.broadcast.emit('user-joined',name);
    });

    // If someone send a message,broadcast it to other connected people
    socket.on('send', message => {
        socket.broadcast.emit('recieve',{message:message, name: users[socket.id]});
    });

    // If someone leave the chat,let other connected people know
    socket.on('disconnect', () => {
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
})