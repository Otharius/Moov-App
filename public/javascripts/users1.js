const data = require('../../data/users.json')
const User = require('/dev/oss2021/public/javascripts/user');
const fs = require('fs')

class Users{
    
    constructor(){}
    #users = new Map();

    add(user) {
        if (this.exist(user.pseudo)) {
            return false;
        }
        this.#users.set(user.pseudo, user);
        return true;
    }

    exist(pseudo){
        return this.#users.has(pseudo);
    }   

    get(pseudo){
        return this.#users.get(pseudo);
    }

    load() {
        for (let i=0; i<data.users.length; i++) {
            const user = new User(
                data.users[i].pseudo,
                data.users[i].nom,
                data.users[i].prenom
            )//.withEmail(data.users[i].pseudo).withPassord(data.users[i].pseudo);
            this.add(user);
            
        }
        return this;
    }
}

module.exports = Users
