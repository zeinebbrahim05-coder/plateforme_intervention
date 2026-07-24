const bcrypt = require('bcrypt');

const plainPassword = 'admin123';

bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) {
        console.log('Erreur :', err);
    } else {
        console.log('Le hash pour "tech123" est :');
        console.log(hash);
    }
});