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
};
document.querySelector('.ajt-photo a').addEventListener('click', openAddModal);

const retourModal = function (e) {
  e.preventDefault();
  const galleryModal = document.getElementById('modal');
  const addImgContainer = document.querySelector('.add-img');

  const imagePreview = addImgContainer.querySelector('img.photo-preview');
  if (imagePreview) {
    addImgContainer.removeChild(imagePreview);
  }

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
const photoFileInput = document.getElementById('photo-file');

photoFileInput.addEventListener('change', async (e) => {
  const selectedFile = e.target.files[0];
  
  const elementsToHide = addImgContainer.querySelectorAll('i, label, p');
  elementsToHide.forEach(element => {
    element.style.display = 'none';
  });

  const imagePreview = document.createElement('img');
  imagePreview.classList.add('photo-preview');
  addImgContainer.appendChild(imagePreview);

  const reader = new FileReader();

  reader.onload = function (e) {
    imagePreview.src = e.target.result;
  };

  reader.readAsDataURL(selectedFile);
});

const resetAddImgContainer = () => {
  const elementsToShow = addImgContainer.querySelectorAll('i, label, p');
  elementsToShow.forEach(element => {
    element.style.display = null;
  });
};
