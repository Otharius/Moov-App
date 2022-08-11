const bcrypt = require('bcrypt');

class User {

    pseudo = '';
    name = '';
    firstname = '';
    email = '';
    password = '';

    constructor(pseudo, name, firstname) {
        this.pseudo = pseudo;
        this.name = name;
        this.firstname = firstname;
    }

    withPassword(password, encrypt=false) {
        if (encrypt) {
            this.password = bcrypt.hashSync(password, 10);
        } else {
            this.password = password;
        }
        return this;
    }

    withEmail(email) {
        this.email = email;
        return this;
    }

    checkPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }

    toObject() {
        return {
            "pseudo": this.pseudo,
            "name": this.name,
            "firstname": this.firstname,
            "email": this.email,
            "password": this.password,
        }
    }
}

module.exports = User