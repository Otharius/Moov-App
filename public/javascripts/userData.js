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

    create() {
        this.req.body.exercice
        const type = exercices.find(i => i.name === this.req.body.exercice)?.type;
        switch (type) {
            case 'footing':
                return new Footing(
                    this.req.body.start,
                    this.req.body.arrival,
                    parseFloat(this.req.body.bounds),
                    parseFloat(this.req.body.time));
            case 'musculation':
                return new Job(
                    this.req.body.exercice, 
                    parseInt(this.req.body.repetition), 
                    parseInt(this.req.body.serie), 
                    this.req.body.repos);
            case 'intensity':
                return new Intensity(
                    this.req.body.speedBloc,
                    this.req.body.speedDistance,
                    this.req.body.speedTime,
                    this.req.body.speedPause,
                    this.req.body.speedDescription);
            
            default:
                return null;
        }
    }

}


// For the musculation
class Job extends AbstractJob {

    type;
    exercice;
    repetitions;
    series;
    pause;
    weight;

    constructor(exercice, repetitions, series, pause) {
        super();
        this.type = 'musculation';
        this.exercice = exercice;
        this.repetitions = repetitions;
        this.series = series;
        this.pause = pause;
        this.weight = 0;
    };
};


// For the running
class Footing extends AbstractJob {

    type;
    start;
    arrival;
    bounds;
    time;

    constructor(start, arrival, bounds, time) {
        super();
        this.type = 'footing';
        this.start = start;
        this.arrival = arrival;
        this.bounds = bounds;
        this.time = time;
    };
};

// For the speed and the intensity
class Intensity extends AbstractJob {

    type;
    bloc;
    distance;
    repetition;
    pause;
    description;

    constructor(bloc, distance, repetition, pause, description) {
        super();
        this.type = 'intensity';
        this.bloc = bloc;
        this.distance = distance;
        this.repetition = repetition;
        this.pause = pause;
        this.description = description;
    }
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
    Footing,
    Seance,
    Workout,
    Health,
    AbstractJob,
    AbstractJobBuilder,
    UserData,
    setData,
    getData,
}