//crée une modal pour la galerie de photos et gère les événements associés
export function creatModal() {
    initializeBoutonsModal();
    const figure = document.querySelector('#introduction figure');

    const modalContainer = createAndAppendElement(figure, 'div', ['modal-container'], '', 'afterbegin');
    modalContainer.id = 'modal-1';

    const overlay = createAndAppendElement(modalContainer, 'div', ['overlay', 'modal-trigger']);
    const modal = createAndAppendElement(modalContainer, 'div', ['modal']);
    const header = createAndAppendElement(modal, 'header', ['modal-header']);
    const heading = createAndAppendElement(header, 'h1', ['titre-modal'], 'Galerie photos');
    const closeButton = createAndAppendElement(header, 'span', ['close-modal', 'modal-trigger'], 'x');
    const arrowModal = createAndAppendElement(header, 'i', ['fa-solid', 'fa-arrow-left', 'arrow']);
    const containerModal = createAndAppendElement(modal, 'div', ['modal-content']);

    recupererTravail()
        .then(donnees => afficherImagesModal(donnees));

    const footer = createAndAppendElement(modal, 'footer', ['modal-footer']);
    const boutonsAjouter = createAndAppendElement(footer, 'button', ['bouton-ajouter'], 'Ajouter une photo');

    closeButton.addEventListener("click", (e) => {
        e.preventDefault();
        const form = document.querySelector("#modal-form");
        const modalButton1 = document.querySelector('.btn1');
        const modalButton2 = document.querySelector('.btn2');
        const modalButton3 = document.querySelector('.btn3');
        modalButton1.style.zIndex = "1";
        modalButton2.style.zIndex = "1";
        modalButton3.style.zIndex = "1";
        modalContainer.classList.remove("active");
        console.log('test close modal');
        if (form) {
            form.reset();
        }
        recupererTravail()
            .then(donnees => afficherImages(donnees));
    });

    boutonsAjouter.addEventListener("click", function() {
        const modalContainer = document.querySelector('.modal-content');
        const imageWrapper = document.querySelector('.images-wrapper');
        imageWrapper.style.display = "none";
        modalContainer.style.display = 'flex';
        boutonsAjouter.setAttribute('id', 'addWorks');
        if (!document.getElementById('modal-form')) {
            creatForm(modalContainer);
        }
        boutonsAjouter.style.display = 'none';
    });

    arrowModal.addEventListener("click", function() {
        const form = document.querySelector('form');
        const boutonAjouter = document.querySelector('.bouton-ajouter');
        boutonAjouter.style.display = 'block';
        boutonAjouter.removeAttribute("id");
        form.remove();
        const arrowModal = document.querySelector('.arrow');
        arrowModal.style.display = "none";
        const heading = document.querySelector('.titre-modal');
        heading.textContent = 'Galerie-photo';
        const boutonValider = document.querySelector('.bouton-ajouter');
        boutonValider.textContent = "Ajouter une photo";
        boutonValider.style.background = "#b3b3b3;";
        boutonValider.style.border = "1px solid #b3b3b3;";
        const boutonSupprimer = document.querySelector('.bouton-supprimer');
        boutonSupprimer.style.display = "block";
        const modalContainer = document.querySelector('.modal-content');
        modalContainer.style.display = "grid";
        recupererTravail()
            .then(donnees => afficherImagesModal(donnees));
    });

    const boutonSupprimer = document.createElement('button');
    boutonSupprimer.textContent = "Supprimer la galerie";
    boutonSupprimer.classList.add('bouton-supprimer');
    footer.appendChild(boutonSupprimer);



    boutonSupprimer.addEventListener('click', (e) => {
        e.preventDefault();
        supprimerToutlesTravaux();
    });

    window.addEventListener('click', (event) => {
        if (event.target === overlay) {
            event.preventDefault();
            const form = document.querySelector("#modal-form");
            const modalButton1 = document.querySelector('.btn1');
            const modalButton2 = document.querySelector('.btn2');
            const modalButton3 = document.querySelector('.btn3');
            modalButton1.style.zIndex = "1";
            modalButton2.style.zIndex = "1";
            modalButton3.style.zIndex = "1";
            modalContainer.classList.remove("active");
            console.log('test close modal');
            if (form) {
                form.remove();
            }
        }
    });

}

export function supprimerToutlesTravaux() {
    // Récupère la liste de tous les éléments
    fetch('http://localhost:5678/api/works', {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem("token") // Ajoute le token d'authentification
            }
        })
        .then(response => {
            // Vérifie si la réponse renvoie une erreur
            if (!response.ok) {
                throw new Error('Erreur ' + response.status + ': ' + response.statusText);
            }
            // Si la réponse est OK, récupère les données JSON
            return response.json();
        })
        .then(data => {
            // Pour chaque élément, effectue une requête DELETE
            data.forEach(item => {
                fetch('http://localhost:5678/api/works/' + item.id, {
                        method: 'DELETE',
                        headers: {
                            Authorization: 'Bearer ' + sessionStorage.getItem("token") // Ajoute le token d'authentification
                        }
                    })
                    .then(response => {
                        // Vérifie si la réponse renvoie une erreur
                        if (!response.ok) {
                            throw new Error('Erreur ' + response.status + ': ' + response.statusText);
                        }
                        console.log('La ressource ' + item.id + ' a été supprimée avec succès', +response.status);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            });

            // Met à jour l'affichage des images après la suppression
            recupererTravail().then(données => {
                afficherImagesModal(données);
            });
        })
        .catch(error => {
            console.error(error);
        });
}
//crée et ajoute un élément avec des classes, un texte et une position spécifiés, puis l'ajoute au parent
export function createAndAppendElement(parent, elementType, classList = [], textContent = '', position = 'beforeend') {
    const element = document.createElement(elementType);
    element.classList.add(...classList);
    element.textContent = textContent;
    parent.insertAdjacentElement(position, element);
    return element;
}

//récupère les données des travaux (photos) à partir de l'API
export function recupererTravail() {
    return fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .catch(erreur => console.error(erreur));
}

//affiche les images dans la galerie à partir des données fournies
export function afficherImages(images) {
    const conteneurImages = document.querySelector('.gallery');
    conteneurImages.innerHTML = "";
    images.forEach(element => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.setAttribute('src', element.imageUrl);
        img.setAttribute('alt', element.title);
        img.setAttribute('category', element.categoryId);
        img.setAttribute('crossorigin', 'anonymous');
        figcaption.textContent = element.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        conteneurImages.appendChild(figure);
    });
}

//affiche les images dans le modal à partir des données fournies
export function afficherImagesModal(images) {
    const imagesContainer = document.querySelector(".modal-content");
    imagesContainer.innerHTML = "";

    const imagesWrapper = document.createElement("div");
    imagesWrapper.classList.add("images-wrapper");

    images.forEach((item) => {
        const img = document.createElement("img");
        const figure = document.createElement("figure");
        const figcaption = document.createElement("figcaption");
        img.src = item.imageUrl;
        img.alt = item.title;
        img.setAttribute("data-id", item.id);
        img.crossOrigin = "anonymous";
        figure.classList.add("figure-modal");
        figure.append(img);
        const editIcon = document.createElement("i");
        editIcon.classList.add(
            "fa-solid",
            "fa-arrows-up-down-left-right",
            "icon-drag"
        );
        figure.append(editIcon);
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("bx", "fa-solid", "fa-trash-can", "icon-trash");
        figure.append(deleteIcon);
        figcaption.textContent = "éditer";
        figcaption.id = "figcaptionModal";
        figure.append(figcaption);
        imagesWrapper.append(figure);


    });



    imagesContainer.append(imagesWrapper);

    const imageWrapper = document.querySelector('.images-wrapper');
    if (imageWrapper !== null) {
        const galleryModals = document.querySelectorAll('.figure-modal');

        //Ajoute les écouteurs d'événements à chaque élément ayant la classe "figure-modal"
        galleryModals.forEach(function(galleryModal) {
            galleryModal.addEventListener('mouseover', function(event) {
                const figure = event.target.closest('figure');
                if (figure) {
                    figure.querySelector('.fa-arrows-up-down-left-right').style.display = 'block';
                }
            });

            galleryModal.addEventListener('mouseout', function(event) {
                const figure = event.target.closest('figure');
                if (figure) {
                    figure.querySelector('.fa-arrows-up-down-left-right').style.display = 'none';
                }
            });
        });
    } else {
        return false;
    }

    imageWrapper.addEventListener('click', function(event) {
        event.preventDefault();
        if (event.target.classList.contains('icon-trash')) {
            const figure = event.target.closest('figure');
            const workId = figure.querySelector('img').dataset.id;
            const token = sessionStorage.getItem('token');
            // Envoie une requête DELETE pour supprimer l'élément
            fetch(`http://localhost:5678/api/works/${workId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(function(response) {
                    console.log(response);
                    if (response.ok) {

                        // Affiche les projets mis à jour dans la modale

                        // Affiche les projets mis à jour sur la page d'accueil
                        recupererTravail()
                            .then(donnees => afficherImagesModal(donnees));
                    } else {
                        console.error('Erreur lors de la suppression de l\'élément');
                    }
                });
        }
    });
}

//crée un formulaire pour ajouter de nouvelles photos dans le modal
export function creatForm(modalContainer) {
    //création du formulaire
    modalContainer.innerHTML = '';
    const form = document.createElement('form');
    form.setAttribute('id', 'modal-form');


    //inputFile & icon
    const iconPicture = createIcon(['fa-sharp', 'fa-solid', 'fa-image', 'picture', 'fa-xl']);
    const inputFormFile = createInputFormFile();
    inputFormFile.setAttribute('name', 'file');
    //label titre
    const labelTitre = createLabel('Titre', 'titre', 'label-titre');
    const divTitre = createDivWithClass('input-titre');
    const inputTitre = createInput('text', 'titre', 'titre');
    inputTitre.setAttribute('required', 'true');

    //label catégorie
    const labelCategories = createLabel('Catégorie', 'categories', 'categories');
    const selectTag = createSelect('categories-select');
    selectTag.setAttribute('name', 'categoryId');
    const optionCategories = createOption('');

    //bouton valider
    const boutonValider = createAndAppendElement(form, 'button', ['bouton-valider-travail'], 'Valider');


    //effectuer les changements
    const boutonSupprimer = document.querySelector('.bouton-supprimer');
    boutonSupprimer.style.display = 'none';
    const titleModal = document.querySelector('.titre-modal');
    titleModal.textContent = 'Ajout photo';
    const arrowModal = document.querySelector('.arrow');
    arrowModal.style.display = 'block';

    //création des divs pour contenir les éléments du formulaire
    const divInputFile = createDivWithClass('input-file');
    const divInputForm = createDivWithClass('form-group');

    const modalFormDiv = divInputFile;

    const boutonAjouterPhoto = createBoutonAjouterPhoto(modalFormDiv, inputFormFile);

    const spanCaption = createSpanWithClassAndText('text-caption', 'jpg,png: 4mo max');
    const imagePreview = createImagePreview();

    inputFormFile.addEventListener('change', () => {
        if (inputFormFile.files.length > 0) {
            console.log('success ' + inputFormFile.files[0].name);
        } else {
            console.log('nope');
        }


    });

    

    boutonValider.addEventListener('click', async (event) => {
        const fileInput = document.getElementById("image"); 
        const titreInput = document.getElementById("titre");
        const categorieSelect = document.getElementById("categories-select");
    
        if (!fileInput.value) {
            event.preventDefault();
            alert("Veuillez sélectionner un fichier.");
          } else if (!titreInput.value) {
            event.preventDefault();
            alert("Veuillez entrer un titre pour votre fichier.");
          } else if (categorieSelect.value < 1) {
            event.preventDefault();
            alert("Veuillez sélectionner une catégorie pour votre fichier.");
          }else{
            ajouterTravail();
          }
    });

    //ajouter les éléments au DOM
    modalContainer.appendChild(form);
    form.appendChild(divInputFile);
    divInputFile.appendChild(iconPicture);
    divInputFile.appendChild(inputFormFile);
    divInputFile.appendChild(boutonAjouterPhoto);
    divInputFile.appendChild(spanCaption);
    form.appendChild(divInputForm);
    divInputForm.appendChild(divTitre);
    divInputForm.appendChild(labelCategories);
    divInputForm.appendChild(selectTag);
    divTitre.appendChild(labelTitre);
    divTitre.appendChild(inputTitre);
    form.appendChild(boutonValider);
    inputFormFile.addEventListener('change', (event) => {
        inputFormFile.style.display = 'none';

        divInputFile.appendChild(imagePreview);
        const img = imagePreview.querySelector('img');
        const file = event.target.files[0];
        const inputElement = document.getElementById("image");
        const files = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                inputElement.setAttribute("src", reader.result);
                img.src = event.target.result;
                img.style.display = 'block';
            });

            reader.readAsDataURL(file);
        }
    });

    const categorySelect = document.querySelector('select');
fetch('http://localhost:5678/api/categories')
    .then((response) => response.json())
    .then((categories) => {
        // Créer une nouvelle option pour "Choisir une catégorie"
        const defaultOption = document.createElement('option');
        defaultOption.text = 'Choisir une catégorie';
        defaultOption.value ='0';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        categorySelect.appendChild(defaultOption);

        // Ajouter les options pour chaque catégorie
        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category.id;
            option.text = category.name;
            categorySelect.appendChild(option);
            const mySelect = document.getElementById('categories-select');
            const options = mySelect.querySelectorAll('option');
            options.forEach((option) => {
                if (option.textContent.trim() === '') {
                    option.hidden = true;
                }
            });
        });
    })
    .catch((error) => console.error(error));
}

//envoie un travail sur l'API avec fetch
export function ajouterTravail() {

    const imageInput = document.getElementById('image');
    const imageUrl = imageInput.files[0];
    const title = document.getElementById('titre').value;
    const categoryId = document.getElementById('categories-select').value;
    const token = sessionStorage.getItem("token");

    const data = new FormData();
    data.append('title', title);
    data.append('image', imageUrl);
    data.append('category', categoryId);


    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: data,
    }).then((res) => {
        if (res.ok) {
           
            console.log('success');
        } else {
         
            throw new Error('Error status code: ' + res.status);
        }
    }).catch((error) => {
        console.log(error.message);
    });    
}

//crée une icône avec les classes spécifiées
export function createIcon(classes) {
    const icon = document.createElement('i');
    icon.classList.add(...classes);
    return icon;
}

//crée un élément input de type "file" avec des attributs spécifiques pour les fichiers image
export function createInputFormFile() {
    const input = document.createElement('input');
    input.setAttribute('hidden', '');
    input.setAttribute('type', 'file');
    input.setAttribute('id', 'image');
    input.setAttribute('accept', 'image/png');
    input.setAttribute('crossorigin', 'anonymous');
    return input;
}

//crée un élément label avec le texte, l'attribut "for" et l'identifiant spécifiés
export function createLabel(text, forId, labelId) {
    const label = document.createElement('label');
    label.innerText = text;
    label.setAttribute('for', forId);
    label.setAttribute('id', labelId);
    return label;
}

//crée un élément input avec les attributs spécifiés
export function createInput(type, id, name) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('id', id);
    input.setAttribute('name', name);
    return input;
}

//crée un élément div avec la classe spécifiée
export function createDivWithClass(className) {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
}

//crée un élément button avec la classe et le texte spécifiés
export function createButtonWithClassAndText(className, text) {
    const button = document.createElement('button');
    button.classList.add(className);
    button.innerText = text;
    return button;
}

//crée un élément select avec l'attribut "id"
export function createSelect(id) {
    const select = document.createElement('select');
    select.setAttribute('id', id);
    return select;
}

//crée un élément option avec la valeur donnée
export function createOption(value) {
    const option = document.createElement('option');
    option.setAttribute('value', value);
    return option;
}

//crée un élément span avec la classe et un texte
export function createSpanWithClassAndText(className, text) {
    const span = document.createElement('span');
    span.classList.add(className);
    span.innerText = text;
    return span;
}

//crée un élément de prévisualisation d'image
export function createImagePreview() {

    const img = document.createElement('img');
    const figure = document.createElement('figure');
    figure.classList.add('container-preview');
    img.setAttribute('id', 'imagePreview');
    img.style.display = 'none';
    img.style.width = '60%';
    figure.appendChild(img);
    return figure;
}

//crée un bouton pour ajouter une photo et gère l'événement associé
export function createBoutonAjouterPhoto(modalFormDiv, inputFormFile) {
    const boutonAjouterPhoto = createButtonWithClassAndText('bouton-ajouter-photo', '+ Ajouter photo');
    boutonAjouterPhoto.addEventListener('click', (e) => {
        e.preventDefault();
        inputFormFile.click();
        const inputFiles = document.getElementsByClassName('input-file');
        for (let i = 0; i < inputFiles.length; i++) {
            inputFiles[i].style.paddingTop = '0px';
            inputFiles[i].style.paddingBottom = '0px';
        }
        console.log(inputFiles);
        const i = document.querySelector('.picture');
        const span = document.querySelector('.text-caption');
        boutonAjouterPhoto.style.display = 'none';
        i.style.display = 'none';
        span.style.display = 'none';
    });
    return boutonAjouterPhoto;
}

export function initializeBoutonsModal() {
    const figure2 = document.querySelector('#introduction figure');
    const portfolio2 = document.querySelector('.tittle-button-wrapper');
    const article2 = document.querySelector('article');
    const modalButton1 = createModalButton('#modal-2', ' modifier');
    const modalButton2 = createModalButton('#modal-1', ' modifier');
    const modalButton3 = createModalButton('#modal-3', ' modifier');
    modalButton1.classList.add('btn2');
    modalButton2.classList.add('btn1');
    modalButton3.classList.add('btn3');

    figure2.appendChild(modalButton1);
    portfolio2.prepend(modalButton2);
    article2.prepend(modalButton3);

    const modalBtns = document.querySelectorAll('.modal-btn');
    const modalContainers = document.querySelectorAll(".modal-container");
    const closeModal = document.querySelector('.close-modal');
    const overLays = document.querySelectorAll('.overlay');

    modalBtns.forEach(modalBtn => modalBtn.classList.toggle("active"));

    modalButton2.addEventListener("click", (event) => {
        event.preventDefault();
        const modalId = event.target.getAttribute("data-target");
        modalButton1.style.zIndex = "-1";
        modalButton2.style.zIndex = "-1";
        modalButton3.style.zIndex = "-1";
        const modalContainer = document.querySelector(modalId);
        modalContainer.classList.toggle("active");
        console.log(modalId);
    });
}

export function createModalButton(target, buttonText) {
    const button = document.createElement('button');
    button.classList.add('modal-btn', 'modal-trigger');
    button.dataset.target = target;

    const icon = document.createElement('i');
    icon.classList.add('far', 'fa-thin', 'fa-pen-to-square');
    button.appendChild(icon);
    button.appendChild(document.createTextNode(buttonText));

    return button;
}
