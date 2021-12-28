class Account {

    pseudo = '';
    calorie = 0;
    sleep = 0;

    
    constructor(pseudo, calorie, sleep){
        this.pseudo = pseudo;
        this.calorie = calorie;
        this.sleep = sleep;
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
        };
    };
};

module.exports = Account;