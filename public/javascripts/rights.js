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
        console.log(this.groups)
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
            const group = new Group(data[i].name);

            for (let j=0; j<data[i].rights.length; j++) {
                group.addRight(new Right(data[i].rights[j].pseudo, data[i].rights[j].group));
            }

            this.add(group);
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
            objs.push(right.toObject());
        }
        return objs;
    }
}



class Right {

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
            "pseudo": this.pseudo,
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