const bcrypt = require('bcrypt');

const plainPassword = 'tech123';
const hashedPassword = '$2b$10$75PqKc01r9fumq8vucH/l.DNgQxZ.gm25fwm62CP1m19ibSIhcFyK';

bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
    console.log('Résultat :', result);  // Doit afficher true
    console.log('Erreur :', err);
});