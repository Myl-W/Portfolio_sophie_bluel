let tokenValue = localStorage.getItem('token'); // Récupère la valeur du token depuis le localStorage
let works = []; // Déclaration et initialisation de la variable "works"
let image = "";

async function renderWorks(categoryId = null) {
  const gallery = document.getElementById('gallery');
  const galleryModalElement = document.getElementById('gallery-modal');
  gallery.innerHTML = '';
  galleryModalElement.innerHTML = '';

  works.forEach(work => {
    if (categoryId != null && categoryId != work.categoryId) {
      return;
    }

    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const figcaptionElement = document.createElement('figcaption');
    const spanModalDelete = document.createElement('span');
    const trashIcon = document.createElement('i');

    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    figcaptionElement.textContent = work.title;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    gallery.appendChild(figureElement);

    // Crée les éléments HTML pour la galerie modale avec l'option de suppression
    const figureModalElement = figureElement.cloneNode(true);
    const figcaptionModalElement = figureModalElement.querySelector('figcaption');
    figcaptionModalElement.textContent = 'éditer';

    trashIcon.classList.add('fas', 'fa-trash');
    spanModalDelete.appendChild(trashIcon);
    figureModalElement.appendChild(spanModalDelete);
    galleryModalElement.appendChild(figureModalElement);

    figureElement.dataset.categoryId = work.categoryId;
    figureModalElement.dataset.categoryId = work.categoryId;

    // Ajoute un gestionnaire d'événement pour supprimer une œuvre au clic sur l'icône de corbeille
    trashIcon.addEventListener('click', (e) => {e.preventDefault(); deleteWork(work.id)});
  });
}

// Fonction pour supprimer une œuvre en utilisant une requête DELETE
const deleteWork = async (id) => {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenValue}` // Utilise la valeur du token dans l'en-tête de la requête
    }
  });
  if(response.status === '204'){
    console.log('not in found in api');
    const index = works.indexOf(work)
    works.splice(index, 1)
    return;
  }else{
    if (response.ok) {
      for (const work of works) {
        if(work.id == id){
            const index = works.indexOf(work)
            works.splice(index, 1)
            break
        }
      }
      renderWorks();
    } else {
      console.log('Erreur lors de la suppression du travail');
    }
  }
};

function renderFilters(categories, works) {
  const optionTous = document.createElement('button');
  optionTous.value = 'tous';
  optionTous.textContent = 'Tous';
  optionTous.classList.add('filter-button', 'active');
  filterContainer.appendChild(optionTous);

  optionTous.addEventListener('click', function () {
    setActiveButton(optionTous);
    renderWorks();
  });

  categories.forEach(category => {
    const optionElement = document.createElement('button');
    optionElement.value = category.id;
    optionElement.textContent = category.name;
    optionElement.classList.add('filter-button');
    filterContainer.appendChild(optionElement);

    optionElement.addEventListener('click', function () {
      setActiveButton(optionElement);
      renderWorks(optionElement.value);
    });
  });
}

function setActiveButton(button) {
  const buttons = document.querySelectorAll('.filter-button');
  buttons.forEach(btn => {
    if (btn === button) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Fonction pour récupérer les œuvres à partir de l'API
async function getWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  return response.json();
}

// Fonction pour récupérer les catégories à partir de l'API
async function getCategories() {
  const response = await fetch('http://localhost:5678/api/categories');
  return await response.json();
}

// Fonction principale pour exécuter les opérations au chargement de la page
const run = async() => {
  works = await getWorks();
  renderWorks();

  const categories = await getCategories();
  renderFilters(categories, works);
}

run();

const loginElement = document.getElementById('logout');
if (localStorage.getItem('token')) {
  loginElement.textContent = 'logout';
} else {
  loginElement.textContent = 'login';
}

loginElement.addEventListener('click', () => {
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token');
    loginElement.textContent = 'Login';
  }
});

const editionDiv = document.querySelector('.edition');
if (localStorage.getItem('token')) {
  editionDiv.style.display = 'flex';
} else {
  editionDiv.style.display = 'none';
}

const filterContainer = document.getElementById('filter-container');
if (localStorage.getItem('token')) {
  filterContainer.style.display = 'none';
} else {
  filterContainer.style.display = 'flex';
}

const modifDivs = document.querySelectorAll('.modif');
if (localStorage.getItem('token')) {
  modifDivs.forEach(div => {
    div.style.display = 'block';
  });
} else {
  modifDivs.forEach(div => {
    div.style.display = 'none';
  });
}

// Code pour les fonctionnalités modales
let modal = null;
let addModal;

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute('href'));
  modal.style.display = null;
  modal.removeAttribute('aria-hidden');
  modal.setAttribute('aria-modal', 'true');
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

const openAddModal = function (e) {
  e.preventDefault();
  const addModal = document.getElementById('add-modal');
  const galleryModal = document.getElementById('modal');
  galleryModal.style.display = 'none';
  addModal.style.display = null;
  addModal.removeAttribute('aria-hidden');
  addModal.setAttribute('aria-modal', 'true');
  modal = addModal;
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

  const addForm = document.getElementById('add-form');
  addForm.removeEventListener('submit', handleAddPhotoSubmit); // Supprime l'ancien gestionnaire d'événement s'il existe
  addForm.addEventListener('submit', handleAddPhotoSubmit); // Ajoute le nouvel événement de soumission
};

document.querySelector('.ajt-photo a').addEventListener('click', openAddModal);

const retourModal = function (e) {
  e.preventDefault();
  const galleryModal = document.getElementById('modal');
  const addImgContainer = document.querySelector('.add-img');

  resetFileInputAndPreview(); // Réinitialise l'aperçu de l'image et l'élément d'entrée du fichier

  const elementsToShow = addImgContainer.querySelectorAll('i, label, p');
  elementsToShow.forEach(element => {
    element.style.display = null;
  });

  galleryModal.style.display = null;
  addModal.style.display = 'none';
  addModal.setAttribute('aria-hidden', 'true');
  addModal.removeAttribute('aria-modal');
  modal = galleryModal;
  modal.removeEventListener('click', closeModal);
  resetForm();
  resetAddImgContainer();
};

const retourButton = document.querySelector('.js-modal-retour');
retourButton.addEventListener('click', retourModal);

function closeModal(event) {
  if (event) {
    event.preventDefault();
  }
  
  const addImgContainer = document.querySelector('.add-img');

  const imagePreview = addImgContainer.querySelector('img.photo-preview');
  if (imagePreview) {
    addImgContainer.removeChild(imagePreview);
  }

  const elementsToShow = addImgContainer.querySelectorAll('i, label, p');
  elementsToShow.forEach(element => {
    element.style.display = null;
  });

  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
  modal = null;
  resetForm();
  resetAddImgContainer();
};

function resetForm() {
  const form = document.getElementById('add-form');
  form.reset();

  const selectElement = document.getElementById('choix');
  selectElement.value = 'vide';
}

let photoFileInput = document.getElementById('photo-file');

function handleFileInputChange(e) {
  const selectedFile = e.target.files[0];
  resetPhotoPreview(); // Réinitialise l'aperçu de l'image
}

function handleAddPhotoSubmit(e) {
  e.preventDefault();

  alert('Soumission du formulaire de photo réussie !');

  const selectedFile = photoFileInput.files[0];

  if (!selectedFile) {
    alert('Veuillez sélectionner un fichier.');
    return;
  }

  const allowedExtensions = ['jpg', 'jpeg', 'png'];
  const allowedSize = 4 * 1024 * 1024; // 4 Mo

  const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
  const fileSize = selectedFile.size;

  if (!allowedExtensions.includes(fileExtension)) {
    alert('Seules les images au format JPG, JPEG et PNG sont autorisées.');
    return;
  }

  if (fileSize > allowedSize) {
    alert('La taille du fichier dépasse la limite autorisée de 4 Mo.');
    return;
  }

  // Le fichier sélectionné est valide, vous pouvez maintenant envoyer le fichier
  // Ajoutez ici le code pour envoyer le fichier à votre backend

  // Une fois le fichier envoyé avec succès, vous pouvez fermer la modal et effectuer les actions nécessaires
  closeModal();
  resetForm();
  resetAddImgContainer();
  // Effectuez les opérations supplémentaires, si nécessaire, comme actualiser la galerie des photos
}

function resetPhotoPreview() {
  const photoPreviewContainer = document.getElementById('photo-preview-container');
  photoPreviewContainer.innerHTML = ''; // Vide le contenu du conteneur d'aperçu de l'image
}

// Gestionnaire d'événement pour le chargement de la page
window.addEventListener('load', function() {
  addModal = document.getElementById('add-modal');
});

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
});

const stopPropagation = function (e) {
  e.stopPropagation();
};

window.addEventListener('keydown', function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

const addImgContainer = document.querySelector('.add-img');

photoFileInput.addEventListener('change', async (e) => {
  const selectedFile = e.target.files[0];
  const allowedExtensions = ['jpg', 'jpeg', 'png'];
  const allowedSize = 4 * 1024 * 1024; // 4 Mo

  if (selectedFile) {
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    const fileSize = selectedFile.size;

    if (!allowedExtensions.includes(fileExtension)) {
      alert('Seules les images au format JPG, JPEG et PNG sont autorisées.');
      return;
    }

    if (fileSize > allowedSize) {
      alert('La taille du fichier dépasse la limite autorisée de 4 Mo.');
      return;
    }

    // Le fichier sélectionné est valide, continuer le traitement
    // ...
    const elementsToHide = addImgContainer.querySelectorAll('i, label, p');
    elementsToHide.forEach(element => {
      element.style.display = 'none';
    });
  
    const imagePreview = document.createElement('img');
    imagePreview.classList.add('photo-preview');
    imagePreview.id = 'photo-preview';
    addImgContainer.appendChild(imagePreview);
  
    const reader = new FileReader();
  
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
    };
  
    reader.readAsDataURL(selectedFile);
  }
  
});

let submitPhoto = document.getElementById('add-photo-submit');


submitPhoto.addEventListener('click', async (event) => {
  let imageForm = document.getElementById('photo-file');
  let titleForm = document.getElementById('titre')
  let categoryForm = document.getElementById('choix');

  if(imageForm.value === ''){
    alert('Aucune image n\'est sélectionnée');
    return;
  }
  if(titleForm.value === ''){
    alert('Aucun titre n\'est mis');
    return;
  }
  if(categoryForm.value === ''){
    alert('Aucune catégorie n\'est sélectionnée');
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', (imageEvent) => {
    const gallery = document.getElementById('gallery');
    const galleryModalElement = document.getElementById('gallery-modal');

    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    const figcaptionElement = document.createElement('figcaption');
    const spanModalDelete = document.createElement('span');
    const trashIcon = document.createElement('i');

    imgElement.src = imageEvent.target.result;
    imgElement.alt = titleForm.value;
    figcaptionElement.textContent = titleForm.value;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    gallery.appendChild(figureElement);

    // Crée les éléments HTML pour la galerie modale avec l'option de suppression
    const figureModalElement = figureElement.cloneNode(true);
    const figcaptionModalElement = figureModalElement.querySelector('figcaption');
    figcaptionModalElement.textContent = 'éditer';

    trashIcon.classList.add('fas', 'fa-trash');
    spanModalDelete.appendChild(trashIcon);
    figureModalElement.appendChild(spanModalDelete);
    galleryModalElement.appendChild(figureModalElement);

    figureElement.dataset.categoryId = categoryForm.value;
    figureModalElement.dataset.categoryId = categoryForm.value;

    // Ajoute un gestionnaire d'événement pour supprimer une œuvre au clic sur l'icône de corbeille
    console.log(works)
    works.push({category:{id:categoryForm.value,name:''}, categoryId:categoryForm.value, id: works.length + 1, imageUrl: imageEvent.target.result, title: titleForm.value, userId:1, figcaptionElement: titleForm.value})
    trashIcon.addEventListener('click', (e) => {e.preventDefault(); deleteWork(works.length)});
    submitPhoto.addEventListener('click', retourModal);

  });
  reader.readAsDataURL(imageForm.files[0]);

});

const resetAddImgContainer = () => {
  const elementsToShow = addImgContainer.querySelectorAll('i, label, p');
  elementsToShow.forEach(element => {
    element.style.display = null;
  });

  const imagePreview = addImgContainer.querySelector('img.photo-preview');
  if (imagePreview) {
    addImgContainer.removeChild(imagePreview);
  }
};

function resetFileInputAndPreview() {
  photoFileInput.value = null; // Réinitialise la valeur du champ de fichier
  resetAddImgContainer(); // Réinitialise l'aperçu de l'image
  resetPhotoPreview(); // Réinitialise l'aperçu de l'image dans le conteneur
}

function handleAddPhotoSubmit(e) {
  e.preventDefault();
  // Ajoutez ici le code pour envoyer le formulaire d'ajout
}
