const express = require('express'),
    request = require('request'),
    app = express(),
    multer = require('multer'),
    path = require('path'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 3000,
    fs = require('fs'),
    upload = multer({ dest: 'temp' }),
    socket = require('socket.io');


const server = app.listen(port, () => {
    console.log('listening on ', port);
})

const io = socket(server);

io.on('connection', (socket) => {
    console.log('made socket connection ');
    socket.on('chat', (data) => {
        io.sockets.emit('chat', data);
    });


    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });
});

type = upload.single('profilepic');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/writeJSON', (req, res) => {
    writeData().then((message) => {
        console.log('success ', message);
        res.send(message);
    }).catch((error) => {
        console.log('fail ', error);
        res.send(error);
    });
});

app.get('/', (req, res) => {
    res.send(__dirname +'index.html');
});

app.get('/getUserDetails', (req, res) => {
    let contact_number = req.query.mobile;
    let filePath = './appdata/user.json';
    console.log('userfetch ', contact_number);
    let responseData = {};
    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            reject(err);
            res.send({ user: responseData });
        }
        else {
            let usersObj = JSON.parse(data);
            let isUserExists = usersObj.users[contact_number] ? true : false;
            if (isUserExists) {
                responseData = usersObj.users[contact_number];
                console.log('user ', responseData);
                res.send({ user: responseData });
            }
        }

    });
    // res.send({ user: responseData });

});

app.post('/userSignUp', type, function (req, res) {
    let userData = req.body.user ? JSON.parse(req.body.user) : null;
    writeImageToServer(req).then((message) => {

        console.log('image upload success ', message);
        userData.imagepath = message.filename;

        writeData(userData).then((message) => {
            console.log('user write success');
            res.send(message);
        }).catch((error) => {
            console.log('error storing users');
            res.send(error);
        });

    }).catch((error) => {
        console.log('image upload fail ', error);
        res.append('responseHeader', error);
        res.send(error);
    });
});

const writeImageToServer = (req) => {
    return new Promise((resolve, reject) => {
        var tmp_path = req.file;
        let response = {};
        var file = __dirname + "/public/uploads/" + req.file.originalname;
        fs.readFile(req.file.path, function (err, data) {
            fs.writeFile(file, data, function (err) {
                if (err) {
                    console.error(err);
                    response.message = 'Sorry, file couldn\'t be uploaded.';
                    response.filename = req.file.originalname
                    reject(response);
                } else {
                    response.message = 'ImageUploaded';
                    response.filename = 'uploads/' + req.file.originalname;
                    resolve(response);
                }
            });
        });
    });
}

const writeData = (user) => {
    return new Promise((resolve, reject) => {
        let filePath = './appdata/user.json';
        fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
            if (err) {
                reject(err);
            } else {
                let usersObj = JSON.parse(data); //now it an object
                let contact_number = user.mobile;
                let newUserObj = user;
                newUserObj.chats = [];

                let isUserExists = usersObj.users[contact_number] ? true : false;

                if (!isUserExists) {
                    console.log('file read success ', usersObj.users[contact_number]);
                    usersObj.users[contact_number] = newUserObj;
                    let json = JSON.stringify(usersObj);
                    fs.writeFile(filePath, json, 'utf8', function (err) {
                        if (err) {
                            reject('Error writing user ' + err);
                        } else {
                            resolve('file write successfull');
                        }
                    }); // write it back 
                }
                else {
                    reject('User Already Exists !!!');
                }
            }
        });
    });
}

app.get('/getData', (req, res) => {
    res.send({ success: "true" });
});
