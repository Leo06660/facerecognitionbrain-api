const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
          const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
          if (isValid) {
              return db.select('*').from('users') // Don't forgot the return
                        .where('email', '=', req.body.email)
                        .then(user => {
                            res.json(user[0])
                        })
                        .catch(err => res.status(400).json('Unable to get user'))
          } else {
              res.status(400).json('Wrong credentials')
          }
      })
      .catch(err => res.status(400).json('Wrong credentials'))
})

// enter new user to database
app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users') // here has to be trx not db
            .returning('*') // users return all the columns
            .insert({
                email: loginEmail[0], // returning array
                name: name,
                joined: new Date()
            })
            .then(user => { // respond to the Front-End
                res.json(user[0]); // respond the first thing in array
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('The email is repeated'))    
})

// find user by userID
app.get('/profile/:id', (req, res) => {
   const { id } = req.params;
//    let found = false;
    db.select('*').from('users')
        // .where({
        //     id: id
        // })
        .where({id}) // same approach
        .then(user => {
            if (user.length) {
                // console.log(user[0]);
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
            
        })
        .catch(err => res.status(400).json('Not found'))
//    if (!found) {
//        res.status(400).json('not found');
//    }
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    db('users').where('id', '=', id) // where the id equals to the id that we received in the body
      .increment('entries', 1)
      .returning('entries')
      .then(entries => {
          res.json(entries[0]);
      })
      .catch(err => res.status(400).json('Unable to get entries'))
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++
    //         return res.json(user.entries);
    //     }
    // })
    // if (!found) {
    //     res.status(400).json('not found');
    // }
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})

/*
    / root route --> res = this is working
    /signin --> POST = success/fail
    /register --> POST = user
    /profile/:userId --> GET = user
    /image --> PUT --> user
*/ 