// on supprime les localStorage 
sessionStorage.clear();

//Sélectionner le formulaire dans le html
const form = document.getElementById('login_form');

//écouter le bouton sumbit sur le formulaire de connexion
form.addEventListener('submit', async (event) => {
    //empêcher le rechargement de la page
    event.preventDefault();

    //On récupère la valeur des champs dans le formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        let userId = data.userId;
        if (userId == 1) {
            let token = data;
            sessionStorage.setItem('token', token.token);
            //redirection vers l'index.html
            document.location.href = "index.html";
        } else {
            let errorMsg = document.getElementById('error-message');
            errorMsg.textContent = "Identifiant ou mot de passe incorrect !";
        }
    } catch (error) {
        console.error(error);
    }
});

