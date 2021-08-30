const data = require('../../data/workout.json');
const Workout = require('./workout');
const fs = require('fs')

class Workouts {

    workouts = new Map();

    constructor() {
    }

    
 
    add (workout) {
        this.workouts.set(workout.pseudo, workout);
        return true;
    }

    get (pseudo) {
        return this.workouts.get(pseudo);
    }

    load () {
            this.add(new Workout(
                data.type,
                data.serie,
                data.rep,
                data.repos,
                data.time,
                data.date,
                data.note,
            )
        );
        return this;
    } 

    save (pseudo) {
        const objs = [];
        for (let workout of this.workouts.values()) {
            objs.push(workout.toObject());
        }
        const buffer = JSON.stringify(objs);
        fs.writeFile('data/' + pseudo + '.json', buffer, function (err) {
            if (err) throw err;
        })
    } 
}

module.exports = Workouts
