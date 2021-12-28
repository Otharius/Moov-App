const fs = require('fs');

class Job {

    exercice;
    repetitions;
    series;
    pause;

    constructor(exercice, repetitions, series, pause) {
        this.exercice = exercice;
        this.repetitions = repetitions;
        this.series = series;
        this.pause = pause;
    };

};

class Seance {
    
    name = '';
    date = '';
    difficulty = null;
    done = false;
    detail = '';
    type = '';
    jobs;
    duration = null;
    note = null;

    constructor(name, date, difficulty, done, detail, type) {
        this.name = name;
        this.date = date;
        this.difficulty = difficulty;
        this.done = done;
        this.detail = detail;
        this.type = type;
        this.jobs = [];
    };

    add (job) {
        this.jobs.push(job);
        return this;
    };

};

class Workout {

    pseudo;
    seances;

    constructor(pseudo) {
        this.pseudo = pseudo;
        this.seances = [];
    };

    add (seance) {
        // Pour que le push fonctionne, il faut que ds le json ce soit comme ça: {"pseudo":"tatata","seances":[]}. Tout cela au minimum
        this.seances.push(seance);
        return this;
    };

    load () {
        try {
            this.seances = require('../../data/'+ this.pseudo +'.json').seances;
        } catch  (error) {
            this.seances = [];
        };
        return this;
    };

    delete (place) {
        console.log("PLACE" + place);
        this.seances.splice(place, 1);
        //this.seances.shift();
        return this;
    };

    save () {
        fs.writeFile('data/' + this.pseudo + '.json', JSON.stringify(this), function (err) {
            if (err) throw err;
        });
    };

    create (pseudo) {
        fs.writeFile('data/' + pseudo + '.json', '[]', function (err) {
            if (err) throw err;
        });
    };
};

module.exports = {
    Job,
    Seance,
    Workout
}