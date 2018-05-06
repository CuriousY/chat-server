let socket = io.connect('http://192.168.1.208:3000/');

//chatBody
//btnSend

let message = document.getElementById('message');
btnSend = document.getElementById('btnSend');
chatContainer = document.getElementById('chatBody');
sender = window.location.href.split('?').length > 1 ? window.location.href.split('?')[1] : 'anonymous';


message.addEventListener('keypress', () => {
    console.log('typing ');
    socket.emit('typing', sender);
});

btnSend.addEventListener('click', () => {
    let today = new Date();
    let timeString = today.getHours() + ":" + getFullMinutes(today.getMinutes());

    if (message.value != null && message.value != '') {
        socket.emit('chat', {
            time: timeString,
            message: message.value,
            sender: sender
        });
    }
    message.value = "";
});

function getFullMinutes(minutes) {
    if (minutes < 10) {
        return '0' + minutes;
    }
    return minutes;
};


socket.on('chat', (data) => {
    $('#chatBody').append('<div class="container"><div class="user"><img src="images/default.png" alt="Avatar" style="width:100%;"><span class="username">' + data.sender + '</span></div><div class="msg"><p class="chatBox">' + data.message + '</p><span class="time-right">' + data.time + '</span></div></div>');
    $('#feedback').text('');
});

socket.on('typing', (data) => {
    $('#feedback').text('').append(`${data} is typing ...`);
});