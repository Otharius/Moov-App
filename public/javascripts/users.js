let data = require('../../data/users.json');
const User = require('./user');
const fs = require('fs');

function loadChirp(){
    $.getJSON(data)
    
    setTimeout("loadChirp()",5000)
    }


class Users {
    
    users = new Map();

    constructor() {
    }

    
 
    add (user) {
        if (this.exist(user.pseudo)) {
            return false;
        }
        this.users.set(user.pseudo, user);
        return true;
    }

    exist (pseudo) {
        return this.users.has(pseudo);
    }

    get (pseudo) {
        return this.users.get(pseudo);
    }

    load () {
        delete require.cache[require.resolve('../../data/users.json')];
 
        data = require('../../data/users.json');
        for (let i=0; i<data.length; i++) {
            this.add(new User(
                data[i].pseudo,
                data[i].name,
                data[i].firstname,
                data[i].boost,
            )
            .withEmail(data[i].email)
            .withPassword(data[i].password));
        }

        console.log('LOAD');
        console.log(this);
        return this;
    } 

    save () {
        const objs = [];
        for (let user of this.users.values()) {
            objs.push(user.toObject());
        }
        const buffer = JSON.stringify(objs);
        fs.writeFile('data/users.json', buffer, function (err) {
            if (err) throw err;
        })
        console.log('SAVE');
        console.log(buffer);
    } 

}

module.exports = Users
