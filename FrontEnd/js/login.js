function showPassword() {
  const passwordField = document.getElementById('password');
  const showPasswordCheckbox = document.getElementById('showMdp');

  if (showPasswordCheckbox.checked) {
    passwordField.type = 'text';
  } else {
    passwordField.type = 'password';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const showPasswordCheckbox = document.getElementById('showMdp');
  showPasswordCheckbox.addEventListener('change', showPassword);

  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
      email: email,
      password: password
    };

    fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erreur lors de la requête de login');
        }
      })
      .then(data => {
        if (data.userId && data.token) {
          const token = data.token;
          localStorage.setItem('token', token);
          window.location.href = './index.html';
        } else {
          const errorContainer = document.getElementById('error-container');
          const error = document.createElement('p');
          error.innerText = 'Email ou mot de passe incorrect';
          error.style.textAlign = 'center';
          error.style.color = 'red';
          error.style.marginBottom = '35px';
          errorContainer.appendChild(error);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la requête de login:', error);
      });
  });
});
