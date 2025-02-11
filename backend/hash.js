const bcrypt = require('bcrypt');

(async () => {
    const password = 'Yaerinz123'; // Replace with your admin password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    console.log('Hashed Password:', hashedPassword);
})();
