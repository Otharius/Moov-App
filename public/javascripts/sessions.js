const Session = require('./session')

class Sessions {

    lastToken = 0;

    sessions = new Map();

    constructor() {
    }

    create(user) {
        if (this.exist(user)) {
            return false;
        }
        return new Session(this.getNewToken(), user)
    }

    add (session) {
        if (this.exist(session.token)) {
            return false;
        }
        this.sessions.set(session.token, session);
        return true;
    }

    login(user) {
        const session = this.create(user);
        this.add(session);
    }

    exist (token) {
        return this.sessions.has(token);
    }

    get (token) {
        return this.sessions.get(token);
    }

    getSession(user) {
        console.log('GETSESSION');
        console.log(user);
        for (let session of this.sessions.values()) {
            console.log('SESSION')
            console.log(session);
            console.log('SESSION USER')
            console.log(session.user);
            if (session.user === user) {
                return session;
            }
        }
    }

    getNewToken() {
        if (this.lastToken < 100000 ) {
            this.lastToken = this.lastToken + 1;
        } else {
            this.lastToken = 1;
        }
        return this.lastToken;
    }

}

module.exports = Sessions