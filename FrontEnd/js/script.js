"use strict";
// mode permettant un js sécurisé

// Import des fonctions utilitaires
import {
    creatModal,
    createAndAppendElement,
    recupererTravail,
    afficherImages,
} from './utils.js';

// Lorsque le document est prêt
document.addEventListener("DOMContentLoaded", async function() {

    const images = await recupererTravail(); 
    afficherImages(images);
    console.log(images)

    // verifie si le token de session est valide 
    if (sessionStorage.getItem("token") && sessionStorage.getItem("token") !== "undefined") {
        console.log("successfully");

        //Crée le conteneur d'édition
        createContainerEdition();
        // Modifie le bouton de connexion en bouton de deconnexion
        document.getElementById("login").innerHTML = "logout";

        //Crée le conteneur de la fenêtre modale
        const modalContainer = document.createElement('div');
        creatModal(modalContainer);
       
        // Vide le sessionStorage et redirige l'utilisateur vers la page de connexion
        let btnLogout = document.getElementById("login");
        btnLogout.addEventListener("click", function() {
            clearSessionStorage();
        })
    }

    const categories = await recupererCategories();
    traitementCategories(categories);
});

//Récupère les catégories depuis l'API
async function recupererCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    return await response.json();
}

//Traite et affiche les catégories récupérées 
function traitementCategories(categories) {
    const divPortfolio = document.getElementById('portfolio');
    const divBoutons = document.createElement('div');
    divBoutons.className = 'categories';

    const btnAll = document.createElement('button');
    btnAll.textContent = 'Tous';
    divBoutons.appendChild(btnAll);

    const categorySet = new Set(); // Crée un nouvel objet Set pour stocker les catégories uniques
    console.log(categorySet)

    categories.forEach(categorie => {
        categorySet.add(categorie.name); // Ajoute le nom de la catégorie à l'ensemble

        const button = document.createElement('button');
        button.textContent = categorie.name;
        button.id = categorie.id;
        divBoutons.appendChild(button);
        divPortfolio.querySelector('h2').insertAdjacentElement('afterend', divBoutons);

        button.addEventListener('click', function() {
            const id = this.id;
            document.querySelectorAll('.gallery img').forEach(image => {
                if (image.getAttribute('category') === id) {
                    image.parentElement.style.display = 'block';
                } else {
                    image.parentElement.style.display = 'none';
                }
            });
        });
    });

    btnAll.addEventListener('click', function() {
        document.querySelectorAll('.gallery img').forEach(image => {
            image.parentElement.style.display = 'block';
        });
    });
}

//Crée et affiche le conteneur d'édition 
function createContainerEdition() {
    const containerEdition = createAndAppendElement(document.body, 'div', ['container-edition'], '', 'afterbegin');
 
    const icon = createAndAppendElement(containerEdition, 'i', ['far', 'fa-edit', 'fa-pen-to-square']);
 
    const text = createAndAppendElement(containerEdition, 'div', ['text']);
 
    const p1 = createAndAppendElement(text, 'p', [], "Mode édition");
    p1.setAttribute('id', 'thin');
 
    const p2 = createAndAppendElement(text, 'button', [], "publier les changements");
    p2.setAttribute('id', 'bold');
}