// const bcrypt = require('bcrypt-nodejs');  // Another option to import

const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    // validation
    if (!email || !name || !password) {
        // reutrn is reuqired to end execution
        return res.status(400).json('Incorrect form submission')
    }
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
}

module.exports = {
    handleRegister: handleRegister
}