const bcrypt = require('bcrypt');
const password = 'Yaerinzsales123';  // User password

bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;
    console.log(hashedPassword);  // Use this hashed password when inserting into the DB
});
