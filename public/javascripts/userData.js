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

class AbstractJob {

    constructor() {
    }

}

class Run extends AbstractJob {

    start;
    arrival;
    bounds;
    time;

    constructor(start, arrival, bounds, time) {
        super();
        this.start = start;
        this.arrival = arrival;
        this.bounds = bounds;
        this.time = time;
    };
};

class Fractionne extends AbstractJob {

    bloc;
    pause;
    course;
    distance;
    description;

    constructor(bloc, pause, course, distance, description) {
        super();
        this.bloc = bloc;
        this.pause = pause;
        this.course = course;
        this.distance = distance;
        this.description = description;
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

    load(data) {
        for (let s of data.workout.seances) {
            this.add(s);
        }
    }

    add(seance) {
        this.seances.push(seance);
        return this;
    };

    delete(place) {
        this.seances.splice(place, 1);
        return this;
    };

    deleteJob (place, number) {
        this.seances[number].jobs.splice(place, 1);
        return this;
    };

    addJob (job, number) {
        this.seances[number].jobs.push(job);
        return this;
    }

    getSeance() {
        let a = [];
        
        for (let i = 0; this.seances.length; i++) {
            if (this.seances[i].difficulty === null) {
                a.push(this.seances[i]);
            } 
        };
        return a;
    };

};

class Health {

    calories;
    sleep;
    body;
    height;

    constructor() {
        this.calories = 0;
        this.sleep = 0;
        this.body = [];
        this.height = [];
    };

    delete(place) {
        this.body.splice(place, 1);
        this.height.splice(place, 1);
    };

    add(body, height) {
        this.body.push(body)
        this.height.push(height);
        return this;
    };

    load(data) {
        this.calories = data.health.calories;
        this.sleep = data.health.sleep;
        this.body = data.health.body;
        this.height = data.health.height;
    };

    setCalories(value) {
        this.calories = value;
        return this;
    };

    setSleep(value) {
        this.sleep = value;
        return this;
    };
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

    addSeance(data) {
        return this.workout.addSeance(data);
    };


    load() {
        this.health = new Health();
        this.workout = new Workout();
        try {
            const data = require('../../data/' + this.pseudo + '.json');
            this.health.load(data);
            this.workout.load(data);
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

const getData = (pseudo) => {
    return map.get(pseudo); 
};

const setData = (pseudo, data) => {
    return map.set(pseudo, data);
};

const map = new Map();

module.exports = {
    Job,
    Run,
    Fractionne,
    Seance,
    Workout,
    Health,
    UserData,
    setData,
    getData,
}