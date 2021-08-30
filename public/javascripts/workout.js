
class Workout {

    type = '';
    serie = '';
    rep = '';
    repos = '';
    time = '';
    date = '';
    note = '';

    
    constructor(type, serie, rep, repos, time, date, note){
        this.type = type;
        this.serie = serie;
        this.rep = rep;
        this.repos = repos;
        this.time = time;
        this.date = date; 
        this.note = note;
    }

    toObject() {
        return {
            "type": this.type,
            "serie": this.serie,
            "rep": this.rep,
            "repos": this.repos,
            "time": this.time,
            "date": this.date,
            "note": this.note,
        }
    }
}

module.exports = Workout