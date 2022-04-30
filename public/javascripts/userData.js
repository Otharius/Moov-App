const fs = require('fs');
const exercices = require('../../data/exercices.json').exerciceWorkout;

class AbstractJob {

    constructor() {
    }

}

class AbstractJobBuilder {
    

    constructor(req) {
        this.req = req;
    }

    create () {
        const a = req.body;
        new Training(a.exercice, a.repetitions)
    }
}


// For the musculation
class Training extends AbstractJob {

    constructor() {
        super();
        this.exercice = null;
        this.repetitions = null;
        this.series = null;
        this.pause = null;
        this.weight = null;
        this.distance = null;
        this.duration = null;
        this.time = null;
        this.start = null;
        this.arrival = null;
        this.description = null;
    };

    withExercice(exercice) {
        this.exercice = exercice;
        return this;
    };

    withRepetitions(repetitions) {
        this.repetitions = repetitions;
        return this;
    };

    withSeries(series) {
        this.series = series;
        return this;
    };

    withPause(pause) {
        this.pause = pause;
        return this;
    };

    withWeight(weight) {
        this.weight = weight;
        return this;
    };

    withDistance(distance) {
        this.distance = distance;
        return this;
    };

    withDuration(duration) {
        this.duration = duration;
        return this;
    };

    withTime(time) {
        this.time = time;
        return this;
    };

    withStart(start) {
        this.start = start;
        return this;
    };

    withArrival(arrival) {
        this.arrival = arrival;
        return this;
    };

    withDescription(description) {
        this.description = description;
        return this;
    };
};

class Seance {

    name = '';
    date = '';
    difficulty = null;
    done = false;
    detail = '';
    jobs;
    duration = null;
    note = null;

    constructor(name, date, detail) {
        this.name = name;
        this.date = date;
        this.difficulty = null;
        this.done = false;
        this.detail = detail;
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
            const data = require('../../data/usersFile/' + this.pseudo + '.json');
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
        fs.writeFile('data/usersFile/' + this.pseudo + '.json', JSON.stringify(this), function (err) {
            if (err) throw err;
        });
    };

    create(pseudo) {
        fs.writeFile('data/usersFile/' + pseudo + '.json', '[]', function (err) {
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
    Training,
    Seance,
    Workout,
    Health,
    AbstractJob,
    AbstractJobBuilder,
    UserData,
    setData,
    getData,
}