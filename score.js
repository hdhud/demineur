const leaderboard = document.getElementById('leaderboard');
const joueur = document.getElementById('joueur');
const joueurliste = document.getElementById('joueurliste');
const joueurinfo = document.getElementById('joueurinfo');
const difficulte = document.getElementById('difficulte');
const filepath = 'score.json';
let difficulté = "Facile";
let joueurs ;
let top10 = [];
let jsondata ;
let leaderboarddata ;
fetch('leaderboard.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur réseau : ' + response.status);
        }
        return response.json(); // Convertit la réponse en JSON
    })
    .then(data => {
        if (Array.isArray(data) && data.length > 0) {
            // Accédez à la valeur du score dans le tableau JSON
            leaderboarddata = data;
            updateleaderboard();
        } else {
            console.error('Le fichier JSON ne contient pas de score valide.');
        }
    });
fetch('score.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur réseau : ' + response.status);
    }
    return response.json(); // Convertit la réponse en JSON
  })
  .then(data => {
    if (Array.isArray(data) && data.length > 0) {
      // Accédez à la valeur du score dans le tableau JSON
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
            joueurliste.innerHTML += '<option>' + data[i].Pseudo +'</option>';
            if (i == 0) {
                joueurs = data[i].Pseudo;
                for (let j = 0; j < data[i].Facile.Parties.length; j++) {
                    joueurinfo.innerHTML += '<p>' + data[i].Facile.Parties[j] + ' : ' + data[i].Facile.Parties[j].Time + '</p>';
                }
            }
        }
        jsondata = data;
    } else {
      console.error('Le fichier JSON ne contient pas de score valide.');
    }
  })

joueurliste.addEventListener('change', function() {
    joueurs = joueurliste[joueurliste.selectedIndex].text;
    console.log(joueurs);
    updatelistscorejoueur();
});
difficulte.addEventListener('change', function() {
    difficulté = difficulte.options[difficulte.selectedIndex].text;
    console.log(difficulté);
    updatelistscorejoueur();
    updateleaderboard();
});

function updatelistscorejoueur(){
    joueurinfo.innerHTML = '';
    for (let i = 0; i < jsondata.length; i++) {
        if (jsondata[i].Pseudo == joueurs) {
            for (let j = 0; j < jsondata[i][difficulté].Parties.length; j++) {
                joueurinfo.innerHTML += '<p>' + jsondata[i][difficulté].Parties[j].Time + '</p>';
            }
            //console.log(jsondata[i][difficulté].Parties);
        }
    }
}
function updateleaderboard(){

    leaderboard.innerHTML = '<h1>Leaderboard</h1>';
    console.log(leaderboarddata);
    for (let i = 0; i < leaderboarddata.length; i++) {
        for (let j = 0; j < leaderboarddata[i][difficulté].Parties.length; j++) {
            leaderboard.innerHTML += '<p>' + leaderboarddata[i][difficulté].Parties[j].Pseudo + ' : ' + leaderboarddata[i][difficulté].Parties[j].Time + '</p>';
        }
    }
    
}
