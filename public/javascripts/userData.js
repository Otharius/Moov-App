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

    add(job) {
        this.jobs.push(job);
        return this;
    };

};

class Workout {

    seances;

    constructor() {
        this.seances = [];
    };

    add(seance) {
        // Pour que le push fonctionne, il faut que ds le json ce soit comme ça: {"pseudo":"tatata","seances":[]}. Tout cela au minimum
        this.seances.push(seance);
        return this;
    };

    delete(place) {
        this.seances.splice(place, 1);
        return this;
    };

};

class Health {

    calories;
    sleep;

    constructor() {
        this.calories = 0;
        this.sleep = 0;
    }

    setCalories(value) {
        this.calories = value;
        return this;
    }

    setSleep(value) {
        this.sleep = value;
        return this;
    }
};

class UserData {

    pseudo;
    health;
    workout;

    constructor(pseudo) {
        this.pseudo = pseudo;
        this.health = new Health();
        this.workout = new Workout();
    };

    load() {
        try {
            const loaded = require('../../data/' + this.pseudo + '.json');
            console.log(loaded);
            this.health = loaded.health;
            this.workout = loaded.workout;
        } catch (error) {
            this.health = new Health();
            this.workout = new Workout();
            this.save();
        };
        return this;
    };

    save() {
        fs.writeFile('data/' + this.pseudo + '.json', JSON.stringify(this), function (err) {
            if (err) throw err;
        });
    };

    create(pseudo) {
        fs.writeFile('data/' + pseudo + '.json', '[]', function (err) {
            if (err) throw err;
        });
    };

}

module.exports = {
    Job,
    Seance,
    Workout,
    Health,
    UserData,
}