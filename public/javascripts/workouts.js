const data = require('../../data/account.json')
const Account = require('./account');
const fs = require('fs')

class Accounts {
    
    accounts = new Map();

    constructor() {
    }

    
 
    add (account) {
        this.accounts.set(account.pseudo, account);
        return true;
    }

    get (pseudo) {
        return this.accounts.get(pseudo);
    }

    load () {
        for (let i=0; i<data.length; i++) {
            this.add(new Account(
                data[i].pseudo,
                data[i].calorie,
                data[i].sleep
            )
        );
        }
        return this;
    } 

    save () {
        const objs = [];
        for (let account of this.accounts.values()) {
            objs.push(account.toObject());
        }
        const buffer = JSON.stringify(objs);
        fs.writeFile('data/account.json', buffer, function (err) {
            if (err) throw err;
        })
    } 
}

module.exports = Accounts
