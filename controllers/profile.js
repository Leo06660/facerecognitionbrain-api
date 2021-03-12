const handleProfileGet = (req, res, db) => {
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
 }

 module.exports = {
    handleProfileGet: handleProfileGet
}