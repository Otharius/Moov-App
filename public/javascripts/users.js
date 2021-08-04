const data = require('../../data/users.json')
const User = require('/dev/oss2021/public/javascripts/user');
const fs = require('fs')

class Users {
    
    users = new Map();

    constructor() {
    }
    
    add(user) {
        if (this.exist(user.pseudo)) {
            return false;
        }
        this.users.set(user.pseudo, user);
        return true;
    }

    exist(pseudo) {
        return this.users.has(pseudo);
    }

    get(pseudo) {
        return this.users.get(pseudo);
    }

    load() {
        for (let i=0; i<data.length; i++) {
            this.add(new User(
                data[i].pseudo,
                data[i].name,
                data[i].firstname
            )
            .withEmail(data[i].email)
            .withPassword(data[i].password));
        }
        return this;
    }

    save () {
        const objs = [];
        for (let user of this.users.values()) {
            objs.push(user.toObject());
        }
        const buffer = JSON.stringify(objs);
        fs.writeFile('data/user.json', buffer, function (err) {
            if (err) throw err;
            console.log('Fichier créé !')
        })
    }
}

module.exports = Users
