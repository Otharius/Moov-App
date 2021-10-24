
lastId = 0;
maxId = 100000;

getNewId() {
    if (lastId < maxId ) {
        lastId++;
    } else {
        lastId = 1;
    }
    return lastId;
}

/**
 * The base class for all workout data objects.
 */
class Event {

    const id = getNewId();

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

    jobsToObjects() {
        const objects = [];
        for (job in jobs) {
            objects.add(job.toObject())
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

module.exports = {
    Event,
    Job,
    Seance
}