
class Event {

    date = '';
    lastId = 0;

    
    constructor(date){
        this.date = date;
    }

}

class Seance extends Event {
    
    difficulty = 1;
    done = false;
    detail = '';
    type = '';

    constructor(date,difficulty, done, detail, type){
        super(date);
        this.difficulty = difficulty;
        this.done = done;
        this.detail = detail;
        this.type = type;
        this.id = this.getNewId()
    }
}

class Preview extends Seance {

    duration = 0;
    note = '';

    constructor(date, difficulty, done, type, detail, duration, note){
        super(date,difficulty,done,type,detail)
        this.duration = duration;
        this.note = note;
    }
}

class Jobs extends Preview {

    exercice = '';
    serie = 0;
    repetition = 0;
    pause = 0;

    constructor(date, difficulty, done, type, detail, duration, note, exercice, serie, repetition, pause){
        super(date, difficulty, done, type, detail, duration, note)
        this.exercice = exercice;
        this.serie = serie;
        this.repetition = repetition;
        this.pause = pause;
    }

    toObject() {
        console.log(this.id)
        return {
            "event":[
                {
                    "date": this.date,
                    "id": this.id,
                    "seance": [
                        {
                            "difficulty": this.difficulty,
                            "detail": this.detail,
                            "done": this.done,
                            "type": this.type,
                            "preview": [
                                {
                                    "duration": this.duration,
                                    "note": this.note,
                                    "jobs": [
                                        {
                                            "exercice": this.exercice,
                                            "serie": this.serie,
                                            "repetition": this.repetition,
                                            "pause": this.pause
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]

            
        }
    }

    getNewId() {
        if (this.lastId < 100000 ) {
            this.lastId = this.lastId + 1;
        } else {
            this.lastId = 1;
        }
        return this.lastId;
    }

}

module.exports = {
    Event,
    Seance,
    Preview,
    Jobs
}