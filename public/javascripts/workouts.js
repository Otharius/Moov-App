const workoutClass = require('./workout');
const Event = workoutClass.Event;
const Seance = workoutClass.Seance;
const Job = workoutClass.Job
const Workout = workoutClass.Workout
const fs = require('fs')

class Workouts {
    
    workouts = new Map();

    constructor() {
    }
 
    add (workout) {
        this.workouts.set(workout.pseudo, workout);
        return this;
    }

    get (pseudo) {
        return this.workouts.get(pseudo);
    }

    load (pseudo, x) {

        const data = require('../../data/' + pseudo + '.json')

        new Workout().load(data);


        return this;
    }


    save (pseudo, create) {
        const objs = [];
        for (let workout of this.workouts.values()) {
            objs.push(workout.toObject());
        }

        if (create) {
            console.log(objs)
            const buffer = JSON.stringify(objs);
            fs.writeFile('data/' + pseudo + '.json', buffer, function (err) {
            console.log("Fichier d'entrainement créé pour " + pseudo + ' !')
            if (err) throw err;
        }          
        )
        
        }

        else {
            const buffer = JSON.stringify(objs);
            fs.appendFile('data/' + pseudo + '.json', buffer, function (err) {
            console.log("Nouvel entrainement pour " + pseudo + ' !')
            if (err) throw err;
        }
        )}
        
    } 
}

module.exports = Workouts
