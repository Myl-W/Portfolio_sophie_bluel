// Création d'un ensemble vide pour stocker tous les travaux
const allWorks = new Set()

// Fonction d'initialisation pour récupérer tous les travaux depuis l'API et les ajouter à l'ensemble
async function init(){
    // Appel de la fonction pour récupérer tous les travaux
    const works = await getAllWorks()
    // Parcourir tous les travaux récupérés et les ajouter à l'ensemble
    for (const work of works) {
        allWorks.add(work)
    }
    // Appel de la fonction pour afficher la galerie
    displayGallery()
}
// Appel de la fonction d'initialisation
init()

// Fonction pour récupérer tous les travaux depuis l'API
async function getAllWorks() {
    // Faire une requête GET à l'endpoint 'http://localhost:5678/api/works' pour récupérer tous les travaux
    const response = await fetch('http://localhost:5678/api/works')
    // Vérifier si la réponse est OK
    if (response.ok) {
        // Convertir la réponse en JSON et la retourner
        return response.json()
    } else {
        // Afficher la réponse dans la console en cas d'erreur
        console.log(response)
    }
}

// Fonction pour afficher la galerie de travaux
function displayGallery(){
    // Afficher tous les travaux stockés dans l'ensemble dans la console
    console.log(allWorks)
}
