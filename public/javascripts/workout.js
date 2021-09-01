
class Event {

    date = '';

    
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
    }
}

class Preview extends Seance {

    duration = 0;
    note = '';

    constructor(date, difficulty, done, detail, duration, note){
        super(date,difficulty,done,detail)
        this.duration = duration;
        this.note = note;
    }
}

class Jobs extends Preview {

    exercice = '';
    serie = 0;
    repetition = 0;
    pause = 0;

    constructor(date, difficulty, done, detail, duration, note, exercice, serie, repetition, pause){
        super(date, difficulty, done, detail, duration, note)
        this.exercice = exercice;
        this.serie = serie;
        this.repetition = repetition;
        this.pause = pause;
    }

    toObject() {
        return {
            "event":[
                {
                    "date": this.date,
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

}

module.exports = {
    Event,
    Seance,
    Preview,
    Jobs
}