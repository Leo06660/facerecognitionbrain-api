const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',  // this indicate localhost
      user : 'leo',
      password : '',
      database : 'smart-brain'
    }
  });

// db.select('*').from('users').then(data => {
//     console.log(data);
// });

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    // res.send('this is working'); 
    res.send('success')
})

// check for sign in
app.post('/signin', (req, res) =>  { signin.handleSignin(req, res, db, bcrypt) })

// enter new user to database
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) // one of the options to import 

// find user by userID
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

// entry increment
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})

/*
    / root route --> res = this is working
    /signin --> POST = success/fail
    /register --> POST = user
    /profile/:userId --> GET = user
    /image --> PUT --> user
*/ 


