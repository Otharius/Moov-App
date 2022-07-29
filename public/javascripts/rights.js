const fs = require('fs');
const { map } = require('jquery');
let data = require('../../data/groups.json');
// La classe qui gère les rôles d'un user d'un groupe


class Groups {
    
    groups = new Map();

    constructor() {
    }


    add (group) {
        this.groups.set(group.name, group);
        return this;
    }

    exist (group) {
        return this.groups.has(group.name);
    }

    get (group) {
        return this.groups.get(group.name);
    }

    load () {
        delete require.cache[require.resolve('../../data/groups.json')];
        data = require('../../data/groups.json');
        
        for (let i=0; i<data.length; i++) {
            this.add(new Group(
                data[i].name,
                data[i].rights,
            ));
        }
        return this;
    } 

    save () {
        const objs = [];


        for (let group of this.groups.values()) {
            objs.push(group.toObject());
            
        }
        const buffer = JSON.stringify(objs);
        fs.writeFile('data/groups.json', buffer, function (err) {
            if (err) throw err;
        })
    } 

}



class Group {

    constructor(name) {
        this.name = name;
        this.rights = new Rights();
    }

    toObject() {
        console.log('AVANT');
        console.log(this.rights.toObject());
        console.log('APRES');
        return {
            "name": this.name,
            "rights": this.rights.toObject(),
        }
    }

    addRight(right) {
        this.rights.add(right);
        return this;
    }
}




class Rights {

    constructor() {
        this.rights = new Map();
    }

    add(right) {
        this.rights.set(right.group, right);
        return this;
    }

    delete(right) {
        this.rights.delete(right.group);
        return this;
    }

    toObject() {
        const objs = [];

        for (let right of this.rights.values()) {
            /*
            console.log('--------------RIGHTS-----------')
            console.log(right)
            console.log('--------------RIGHTS-----------')
            */
            objs.push(right.toObject());
        }
        return objs;
    }
}



class Right {
// user = pseudo
// group = name of group
// others are the rights

    constructor(pseudo, group) {
        this.pseudo = pseudo;
        this.group = group;
        this.admin = false;
        this.coatch = false;
        this.trainee = true;
    }

    grantCoatch () {
        this.coatch = true;
        return this;
    }

    denyCoatch () {
        this.coatch = false;
        return this;
    }

    grantAdmin () {
        this.admin = true;
        return this;
    }

    denyAdmin () {
        this.admin = false;
        return this;
    }

    grantTrainee () {
        this.trainee = true;
        return this;
    }

    denyTrainee () {
        this.trainee = false;
        return this;
    }

    toObject() {
        return {
            "user": this.pseudo,
            "group": this.group,
            "admin": this.admin,
            "coatch": this.coatch,
            "trainee": this.trainee,
        }
    }
}




module.exports = {
    Right,
    Rights,
    Groups,
    Group,
}