class User{
    pseudo = '';
    #nom = '';
    #prenom = '';
    #email = '';
    #password = '';
    constructor(pseudo, nom, prenom){
        this.pseudo = pseudo;
        this.#nom = nom;
        this.#prenom = prenom;
    }
    withPassword(password){
        this.#password = password;
        return this;
    }
    withEmail(email){
        this.#email = email;
        return this;
    }
    checkPassword(password){
        return this.#password === password;
    }
}

module.exports = User