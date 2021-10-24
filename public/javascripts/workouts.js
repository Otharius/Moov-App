const a = require('./workout');
const Event = a.Event;
const Seance = a.Seance;
const Preview = a.Preview;
const Jobs = a.Jobs
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

    load (pseudo, x) {

    if(x){
        const data = require('../../data/' + pseudo + '.json')

        for (let i=0; i<data.length; i++) {
            this.add(new Jobs(
                data[i].date,
                data[i].difficulty,
                data[i].done,
                data[i].type,
                data[i].detail,
                data[i].duration,
                data[i].note,
                data[i].exercice,
                data[i].repetition,
                data[i].pause
            )
        );
        }
        return this;
    }
    else {
        const data = require('../../data/workout.json')

        for (let i=0; i<data.length; i++) {
            this.add(new Jobs(
                data[i].date,
                data[i].difficulty,
                data[i].done,
                data[i].type,
                data[i].detail,
                data[i].duration,
                data[i].note,
                data[i].exercice,
                data[i].repetition,
                data[i].pause
            )
        );
        }
        return this;
    }

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
