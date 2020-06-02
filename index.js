import express from 'express';
import routes from './src/routes/Routes';

const faker = require('faker');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');


const makeId = () => Math.random().toString(36).substring(7);


db.serialize(function () {
    db.run(`CREATE TABLE users
            (
                user_uid   VARCHAR(255) PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name  VARCHAR(255) NOT NULL
            );`);

    db.run(`CREATE TABLE pets
            (
                pets_uid   VARCHAR(255) PRIMARY KEY,
                pets_name VARCHAR(255) NOT NULL,
                pets_age   INTEGER NOT NULL,
                user_uid VARCHAR(255),
                FOREIGN KEY(user_uid) REFERENCES  users(user_uid)
            );`);

    // Seed user
    var stmt = db.prepare("INSERT INTO users VALUES (?,?,?)");
    for (var i = 0; i < 10; i++) {
        stmt.run([makeId(), faker.name.firstName(), faker.name.lastName()]);
    }
    stmt.finalize();

    let user_uid = [];
    db.each("SELECT * FROM users", function (err, row) {
        user_uid.push(row.user_uid);
    });
    
    var stmt = db.prepare("INSERT INTO pets VALUES (?,?,?,?)");
    user_uid.forEach(element => {
       stmt.run([makeId(), faker.name.firstName(), faker.random.number(), element]);
    }); 

    stmt.finalize();


   

})
db.close();


///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
const app = express();
const PORT = 4000;
routes(app);

app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));


app.listen(PORT, () => {
    console.log(` le serveur tourne sur ${PORT} `);
})


