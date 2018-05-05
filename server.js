const express = require('express'),
    request = require('request'),
    app = express(),
	multer=require('multer'),
    path = require('path'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 3000,
    fs = require('fs'),
	upload = multer({ dest: 'uploads/' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.array()); 

app.get('/writeJSON', (req, res) => {
    writeData().then((message) => {
        console.log('success ', message);
        res.send(message);
    }).catch((error) => {
        console.log('fail ', error);
        res.send(error);
    });
});


app.post('/postImage', function (req, res) {
  console.log('inside post ', req);
  res.send({success:'true'});
});

app.get('/getData', (req,res) => {
	res.send({success:"true"});
});

const writeData = () => {
    return new Promise((resolve, reject) => {
        let filePath = './appdata/user.json';
        fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
            if (err) {
                reject(err);
            } else {
                let usersObj = JSON.parse(data); //now it an object
                let contact_number = 9876543211;
                let newUserObj = {
                    contact_number: contact_number,
                    name: "nk",
                    chats: []
                }
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
                else{
                    reject('User Already Exists !!!');
                }
            }
        });
    });
}


app.listen(port, () => {
    console.log('listening on ', port);
})