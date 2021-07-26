//                                  COMMUN
// Base de donnéee à mettre dans le note js
// var data = {
//     "users": [
//         {
//             "id": "1",
//             "pseudo": "papatausore",
//             "prenom": "Richard",
//             "nom": "Le Pennec",
//             "pwd": "papa",
//             "mail": "papa@gmail.com",
//             "birthday": "05/08/1973"
//         },
//         {
//             "id": "2",
//             "pseudo": "Le gneck",
//             "prenom": "Gwen",
//             "nom": "Le Pennec",
//             "pwd": "pwd",
//             "mail": "mail",
//             "birthday": "17/08/2008"
//         },
//         {
//             "id": "3",
//             "pseudo": "Otharius",
//             "prenom": "Loïc",
//             "nom": "Le Pennec",
//             "pwd": "a",
//             "mail": "llepennec101@gmail.com",
//             "birthday": "O5/01/2005"
//         },                

//     ],
//     "work": [
//         {
//             "id": "1",
//             "userId": "1",
//             "preview": "",
//             "difficulty": "",
//             "notes": "",
//             "done": "",
//             "duration": "",
//         },
//         {
//             "id": "2",
//             "userId": "2",
//             "preview": "",
//             "difficulty": "",
//             "notes": "",
//             "done": "",
//             "duration": "",
//         },
//         {   
//             "id": "3",
//             "userId": "3",
//             "preview": "",
//             "difficulty": "",
//             "notes": "",
//             "done": "",
//             "duration": "",
//         } 
//     ],
//     "exercicesWorkout": [
//         {
//             "id": "1",
//             "title": "pompe",
//             "movie": "",
//         },
//         {
//             "id": "2",
//             "title": "squat",
//             "movie": "",
//         },
//         {
//             "id": "3",
//             "title": "traction",
//             "movie": "",
//         },
//         {
//             "id": "4",
//             "title": "dips",
//             "movie": "",
//         }
//     ],
//     "exercicesRunning": [
//         {
//             "id": "1",
//             "title": "10'10'",
//             "movie": "",
//         },
//         {
//             "id": "2",
//             "title": "15'15'",
//             "movie": "",
//         },
//         {
//             "id": "3",
//             "title": "20'20'",
//             "movie": "",
//         },
//         {
//             "id": "4",
//             "title": "30'30'",
//             "movie": "",
//         }
//     ],
//     "jobs": [
//         {
//             "id": "1",
//             "workId": "1",
//             "serie": "5",
//             "rep": "10",
//             "sleep": "1'",
//         },
//         {
//             "id": "2",
//             "workId": "2",
//             "serie": "",
//             "rep": "",
//             "sleep": "",
//         }
//     ],
//     "Seances": [
//         {
//             "jobsId": "1",
//             "jobsId": "2"
//         }
//     ],
//     "evenements": [
// //         {
//             "id": "1",
//             "workId": "1",
//             "date": "",
//         }
//     ],
//     "calender": [
//         {
//             "evemenentId": "1",
//             "userId": "1",
//         }
//     ],
// }

// // Afficher la liste des exercices de musculation
// function addOptionWorkout(){

//     var select = document.getElementById('work_exercice')

//     for(var i=0;i<data.exercicesWorkout.length; i++) {
//             var option = new Option(data.exercicesWorkout[i].title, "")
//             select.options.add(option)
//     }
//     let index = document.getElementById('work_date').selectedIndex
//     let test = document.getElementById('work_exercice').options[index]
//     alert(test)
// }

// // Afficher la liste des exercices de course
// function addOptionRunning(){
//     var select = document.getElementById('running_exercice')

//     for(var i=0;i<data.exercicesRunning.length; i++){
//         var option = new Option(data.exercicesRunning[i].title, "")
//         select.options.add(option)
//     }

// }



// function List(){
//     switch (key) {
//         case value:
            
//             break;
    
//         default:
//             break;
//     }
// }

// // Variable unniverselle
// let active = localStorage.getItem(null)

// // Menu de connexion, choix de l'utilisateur
// function connect(){
//     let pseudo = document.getElementById("pseudo").value;
//     let mdp = document.getElementById("mdp").value;
//     for (let i=0; i<data.users.length; i++) {
//         if ((pseudo === data.users[i].pseudo) && (mdp === data.users[i].pwd)) {
//                 id = i;
//                 break; 
//         }
//     }
//     if (id != null) {
//         active = localStorage.setItem('user', id)
//         open('Accueil.html', '_self');
//     }       
// }
// // Variable des éléments du stockage externe
// let activeUser = localStorage.getItem('user')

// // Fonction pour appeler la page de connexion
// function page(){
//     open('Connexion.html', '_self')
// }

// // Afficher le nom, prénom et âge dans la page profil plus l'heure
// function utilisateurs(document){
//     const index = Number(activeUser);
//     if (activeUser != Number) {
//         document.getElementById('p1').innerHTML = "<strong>Pseudo: </strong>" + data.users[index].pseudo
//         document.getElementById('p2').innerHTML = "<strong>Prénom: </strong>" + data.users[index].prenom
//         document.getElementById('p3').innerHTML = "<strong>Nom: </strong>" + data.users[index].nom
//         document.getElementById('p5').innerHTML = "<strong>Date de naissance: </strong>" + data.users[index].birthday
//         document.getElementById('p6').innerHTML = "<strong>Adresse mail: </strong>" + data.users[index].mail
//     } else {
//         document.getElementById('no').innerHTML = "Utilisateur non identifié";
//     }
//     let temps = new Date();
//         var heure = temps.getHours();
//         var minute = temps.getMinutes();
//     document.getElementById('heure').innerHTML = heure + ':' + minute
// }

// // Fonction pour afficher l'heure sur la page d'entrainement
// function updateDates() {
//     const date1 = new Date();
//     const day = date1.getDate();
//     const month = date1.getMonth();
//     const an = date1.getFullYear();
//     const  mois = month + 1;
//         document.getElementById('date2').innerHTML = day + 2 + '/' + mois 
//         document.getElementById('date3').innerHTML = day + 3 + '/' + mois
// }









// Script pour le nouveau design de la connexion
function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form_message");

    messageElement.textContent = message;
    messageElement.classList.remove("form_message-success", "form_message-error");
    messageElement.classList.add(`form_message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form_input-error");
    inputElement.parentElement.querySelector(".form_input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form_input-error");
    inputElement.parentElement.querySelector(".form_input-error-message").textContent = "";
}


document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        // Perform your AJAX/Fetch login

        setFormMessage(loginForm, "error", "Pseudo ou mot de passe incorrect");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
})
