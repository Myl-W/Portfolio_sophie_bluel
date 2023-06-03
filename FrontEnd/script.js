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
    displayGallery(Array.from(allWorks))
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
function displayGallery(works, category){
    // Afficher tous les travaux stockés dans l'ensemble dans la console
    console.log(allWorks)
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = "";

    for (const article of works) {
        if (category === "all" || article.category === category) {
            const workElement = document.createElement("article");
            const imageWork = document.createElement("img");
            imageWork.src = article.image;
            const nomWork = document.createElement("p");
            nomWork.innerText = article.nom;
        
            workElement.appendChild(imageWork);
            workElement.appendChild(nomWork)
        
            sectionGallery.appendChild(workElement);
        }
    }
}

const categoryFilter = document.getElementById("category-filter");

categoryFilter.addEventListener("change", () => {
  const selectedCategory = categoryFilter.value;
  displayGallery(worksData, selectedCategory);
});

const worksData = [
    {
        "id": 1,
        "nom": "Abajour Tahina",
        "image": "assets/images/abajour-tahina.png",
        "description": "Abajour Tahina",
        "category": "category3"
    },
    {
        "id": 2,
        "nom": "Appartement Paris V",
        "image": "assets/images/appartement-paris-v.png",
        "description": "Appartement Paris V",
        "category": "category1"
    },
    {
        "id": 3,
        "nom": "Restaurant Sushisen - Londres",
        "image": "assets/images/restaurant-sushisen-londres.png",
        "description": "Restaurant Sushisen - Londres",
        "category": "category3"
    },
    {
        "id": 4,
        "nom": "Villa “La Balisiere” - Port Louis",
        "image": "assets/images/la-balisiere.png",
        "description": "Villa “La Balisiere” - Port Louis",
        "category": "category2"
    },
    {
        "id": 5,
        "nom": "Structures Thermopolis",
        "image": "assets/images/structures-thermopolis.png",
        "description": "Structures Thermopolis",
        "category": "category3"
    },
    {
        "id": 6,
        "nom": "Appartement Paris X",
        "image": "assets/images/appartement-paris-x.png",
        "description": "Appartement Paris X",
        "category": "category1"
    },
    {
        "id": 7,
        "nom": "Pavillon “Le coteau” - Cassis",
        "image": "assets/images/le-coteau-cassis.png",
        "description": "Pavillon “Le coteau” - Cassis",
        "category": "category3"
    },
    {
        "id": 8,
        "nom": "Villa Ferneze - Isola d’Elba",
        "image": "assets/images/villa-ferneze.png",
        "description": "Villa Ferneze - Isola d’Elba",
        "category": "category2"
    },
    {
        "id": 9,
        "nom": "Appartement Paris XVIII",
        "image": "assets/images/appartement-paris-xviii.png",
        "description": "Appartement Paris XVIII",
        "category": "category1"
    },
    {
        "id": 10,
        "nom": "Bar “Lullaby” - Paris",
        "image": "assets/images/bar-lullaby-paris.png",
        "description": "Bar “Lullaby” - Paris",
        "category": "category3"
    },
    {
        "id": 11,
        "nom": "Hotel First Arte - New Delhi",
        "image": "assets/images/hotel-first-arte-new-delhi.png",
        "description": "Hotel First Arte - New Delhi",
        "category": "category3"
    }
];

displayGallery(worksData);
