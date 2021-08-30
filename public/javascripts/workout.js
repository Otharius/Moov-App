
class Account {

    pseudo = '';
    type = '';
    serie = '';
    rep = '';
    repos = '';
    time = '';
    date = '';
    note = '';

    
    constructor(pseudo, type, serie, rep, repos, time, date, note){
        this.pseudo = pseudo;
        this.type = type;
        this.serie = serie;
        this.rep = rep;
        this.repos = repos;
        this.time = time;
        this.date = date; 
        this.note = note;
    }

    addCal(calorie) {
        this.calorie = calorie;
        return this;
    }

    toObject() {
        return {
            "pseudo": this.pseudo,
            "calorie": this.calorie,
            "sleep": this.sleep,
        }
    }
}

module.exports = Account