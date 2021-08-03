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
        console.log('ADD');
        console.log(typeof user);
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
        for (let i=0; i<data.users.length; i++) {
            this.add(new User(
                data.users[i].pseudo,
                data.users[i].name,
                data.users[i].firstname
            )
            .withEmail(data.users[i].email)
            .withPassword(data.users[i].password));
        }
        return this;
    }

    save() {
        const objs = [];
        for (let user of this.users.values()) {
            console.log(user.toObject());
            objs.push(user.toObject());
        }
        //this.users.forEach((pseudo,user) => console.log(typeof user) /*objs.push(user.toObject())*/);
        console.log(objs);
        const buffer = JSON.stringify(objs);
        console.log(buffer);
        fs.writeFile('data/user.json', buffer, function (err) {
            if (err) throw err;
            console.log('Fichier créé !')
        })
    }
}

module.exports = Users
