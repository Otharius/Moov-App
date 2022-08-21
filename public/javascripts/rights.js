const fs = require('fs');
let data = require('../../data/groups.json');
// La classe qui gère les rôles d'un user d'un groupe


class Groups {
    
    constructor() {
        this.groups = new Map();
    }

    add (group) {
        this.groups.set(group.name, group);
        return this;
    }

    exist (name) {
        return this.groups.has(name);
    }

    get (name) {
        return this.groups.get(name);
    }

    delete (name) {
        this.groups.delete(name);
        return this;
    }

    load () {
        delete require.cache[require.resolve('../../data/groups.json')];
        data = require('../../data/groups.json');

        for (let i=0; i<data.length; i++) {
            const group = new Group(data[i].name, data[i].open);
            for (let j=0; j<data[i].rights.length; j++) {
                const right = new Right(data[i].rights[j].pseudo, data[i].rights[j].group);
                if (data[i].rights[j].admin === true) {
                    right.grantAdmin();
                };
                if (data[i].rights[j].coatch === true) {
                    right.grantCoatch();
                };
                if (data[i].rights[j].trainee === true) {
                    right.grantTrainee();
                };
                group.addRight(right);
            };

            for (let k=0; k<data[i].seances.length; k++) {
                const seance = new GroupSeance(data[i].seances[k].name, data[i].seances[k].date, data[i].seances[k].detail, data[i].seances[k].duration);
                for (let x=0; x<data[i].seances[k].users.length; x++) {
                   seance.addUser(data[i].seances[k].users[x]);
                }
                group.addSeance(seance);

                for (let z=0; z<data[i].seances[k].jobs.length; z++) {
                    seance.add(data[i].seances[k].jobs[z]);
                }

                for (let y=0; y<data[i].seances[k].done.length; y++) {
                    seance.loadDone(data[i].seances[k].done[y]);
                }

                for (let w=0; w<data[i].seances[k].difficulty.length; w++) {
                    seance.loadDifficulty(data[i].seances[k].difficulty[w]);
                }
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

    constructor(name, open) {
        this.name = name;
        this.open = open;
        this.seances = [];
        this.rights = new Rights();
    }

    toObject() {
        return {
            "name": this.name,
            "open": this.open,
            "seances": this.seances,
            "rights": this.rights.toObject(),
        }
    }

    addSeance(seance) {
        this.seances.push(seance);
        return this;
    }

    deleteSeance(index) {
        this.seances.splice(index, 1);
        return this;
    }

    addRight(right) {
        this.rights.add(right);
        return this;
    }

    deleteRight(pseudo) {
        this.rights.delete(pseudo);
        return this;
    }

    changeStatus() {
        if (this.open === true) {
            this.open = false;
        } else {
            this.open = true;
        }
        return this;
    }

}


class GroupSeance {

    name = '';
    date = '';
    detail = '';
    duration = null;
    time = null;
    jobs;
    note = null;
    difficulty;
    done;

    constructor(name, date, detail, duration) {
        this.name = name;
        this.date = date;
        this.difficulty = [];
        this.done = [];
        this.detail = detail;
        this.duration = duration;
        this.users = [];
        this.jobs = [];
    };

    add(job) {
        this.jobs.push(job);
        return this;
    };

    delete(index) {
        this.jobs.splice(index, 1);
        return this;
    }

    withTime(time) {
        this.time = time;
        return this;
    };

    addUser(user) {
        this.users.push(user);
        return this;
    }

    loadDone(obj) {
        this.done.push(obj)
    }

    addDone(pseudo) {
        this.done.push(this.doneObject(pseudo));
        return this;
    }

    loadDifficulty(obj) {
        this.difficulty.push(obj);
        return this;
    }

    addDifficulty(pseudo) {
        this.difficulty.push(this.difficultyObject(pseudo));
        return this;
    }

    doneObject(pseudo) {
        return {
            "pseudo": pseudo,
            "done": false,
        }
    }

    difficultyObject(pseudo) {
        return {
            "pseudo": pseudo,
            "difficulty": null,
        }
    }
};


class Rights {

    constructor() {
        this.rights = new Map();
    }

    add(right) {
        this.rights.set(right.pseudo, right);
        return this;
    }

    delete(pseudo) {
        this.rights.delete(pseudo);
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
    GroupSeance,
}