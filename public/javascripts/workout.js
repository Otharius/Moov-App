
lastId = 0;
maxId = 100000;

function getNewId() {
    if (lastId < maxId ) {
        lastId++;
    } else {
        lastId = 1;
    }
    return lastId;
}

/*
 * The base class for all workout data objects.
 */
class Event {

    id = getNewId();

}

class Job extends Event {

    exercice;
    repetitions;
    series;
    pause;

    constructor(exercice, repetitions, series, pause) {
        super();
        this.exercice = exercice;
        this.repetitions = repetitions;
        this.series = series;
        this.pause = pause;
    }

    toObject() {
        return {
            "id": this.id,
            "exercice": this.exercice,
            "repetitions": this.repetitions,
            "series": this.series,
            "pause": this.pause
        }
    }
}

class Seance extends Event {
    
    date = '';
    difficulty = 1;
    done = false;
    detail = '';
    type = '';
    jobs;
    duration = null;
    note = null;

    constructor(date, difficulty, done, detail, type) {
        super();
        this.date = date;
        this.difficulty = difficulty;
        this.done = done;
        this.detail = detail;
        this.type = type;
        this.jobs = [];
    }

    add(job) {
        this.jobs.push(job);
        return this;
    }

    jobsToObjects() {
        const objects = [];
        for (let job of this.jobs) {
            objects.push(job.toObject())
        }
        return objects;
    }

    toObject() {
        return {
            "id": this.id,
            "date": this.date,
            "difficulty" : this.difficulty,
            "done": this.done,
            "jobs": this.jobsToObjects()
        }
    }

}

class Workout extends Event {

    seances;

    constructor() {
        super();
        this.seances = [];
    }

    add(seance) {
        this.seances.push(seance);
        return this;
    }

    // data is the array of Seances
    load(data) {
        for (let i=0; i<data.length; i++) {
            const s = data[i];
            const seance = new Seance(s.date, s.difficulty, s.done, s.detail, s.type);
            for (let j=0; j<s.jobs.length; j++) {
                const j = s.jobs[j];
                const job = new Job(j.exercice, j.repetitions, j.series, j.pause);
                seance.add(job);
            }
            this.add(seance);
        }
        return this;
    }

    toObject() {
        const objects = [];
        for (let seance of this.seances) {
            objects.push(seance.toObject())
        }
        return objects;
    }

}

module.exports = {
    Event,
    Job,
    Seance,
    Workout
}