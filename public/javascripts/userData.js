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

    
}


// For the musculation
class Training extends AbstractJob {

    constructor() {
        super();
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

    static create(req, userData) {
        const training = new Training();
        const templateName = req.body.template;
        const fields = userData.templates[templateName].fields;

        if (fields.includes('exercices')) {
            training.withExercice(req.body.exercices);
        };

        if (fields.includes('serie')) {
            training.withSeries(req.body.serie);
        };

        if (fields.includes('repetition')) {
            training.withRepetitions(req.body.repetition);
        };

        if (fields.includes('pause')) {
            training.withPause(req.body.pause);
        };

        return training;
    }
};

class Template {

    constructor (name) {
        this.name = name;
        this.fields = [];
    };

    add(field) {
        if (!this.fields.includes(field)) {
            this.fields.push(field);
        }
        return this;
    };



}

class Seance {

    name = '';
    date = '';
    detail = '';
    duration = null;
    time = null;
    jobs;
    note = null;
    difficulty = null;
    done = false;

    constructor(name, date, detail, duration) {
        this.name = name;
        this.date = date;
        this.difficulty = null;
        this.done = false;
        this.detail = detail;
        this.duration = duration;
        this.jobs = [];
    };

    add(job) {
        this.jobs.push(job);
        return this;
    };

    withTime(time) {
        this.time = time;
        return this;
    };
};

class Workout {

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
    templates;

    constructor(pseudo) {
        this.pseudo = pseudo;
        this.health = new Health();
        this.workout = new Workout();
        this.templates = {};
    };

    addSeance(data) {
        return this.workout.addSeance(data);
    };

    addTemplate(data) {
        if (!this.templates.hasOwnProperty(data.name)) {
            this.templates[data.name] = data;
        };
        return this;
    };

    deleteTemplate (template) {
        Reflect.deleteProperty(this.templates, template)
        return this;
    };

    load() {
        this.health = new Health();
        this.workout = new Workout();
        this.templates = {};
        try {
            const data = require('../../data/usersFile/' + this.pseudo + '.json');
            this.health.load(data);
            this.workout.load(data);
            this.templates = data.templates;
        } catch (error) {
            this.health = new Health();
            this.workout = new Workout();
            this.templates = {};
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
    Template,
    Health,
    AbstractJob,
    AbstractJobBuilder,
    UserData,
    setData,
    getData,
}