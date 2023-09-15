// ------------------------------------------------------------------------
//   HANDLE LOGIN METHODS: SIGN IN / SIGN OUT ON LOGIN PAGE & HEADER
// ------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', (event) => {
    const loginBtn = document.getElementById('loginBtn');
    const closeButton = document.getElementById('closeButton');
    const loginForm = document.querySelector('form[action="/api/members/login"]');
    const loginOverlay = document.getElementById('loginOverlay');
    const newUserLink = document.getElementById('newUserLink');

    if (loginBtn) {
        loginBtn.addEventListener('click', showPopup);
    }

    if (closeButton) {
        closeButton.addEventListener('click', hidePopup);
    }

    // Function to show the popup
    function showPopup() {
        if (loginOverlay) {
            loginOverlay.style.display = 'flex';
        }
    }

    // Function to hide the popup
    function hidePopup() {
        if (loginOverlay) {
            loginOverlay.style.display = 'none';
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const response = await fetch(loginForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(new FormData(loginForm)).toString()
            });

            const data = await response.json();  // Read the response body here

            if (response.ok) {
                // Handle success
                window.location.href = '/';
            } else {
                // Handle errors
                alert(data.errors ? data.errors.map(error => error.msg).join('\n') : 'Invalid username or password, please try again');
            }
        });
    }

    // New User Link in Popup
    if (newUserLink) {
        newUserLink.addEventListener('click', (event) => {
            event.preventDefault();

            if (loginOverlay) {
                loginOverlay.style.display = 'none';
            }
            if (registerOverlay) {
                registerOverlay.style.display = 'flex';
            }
        });
    }

    // Registration form
    const registerForm = document.querySelector('form[action="/api/members/register"]');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(registerForm);
            const response = await fetch(registerForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(formData).toString()
            });

            const data = await response.json();

            if (response.ok) {
                // Handle success
                window.location.href = '/';
            } else {
                // Handle errors
                alert(data.errors ? data.errors.map(error => error.msg).join('\n') : 'An error occurred');
            }
        });
    }
});
// NTS: ON UPDATE: Change error messages to say whats wrong: ie) password must have ... maybe one of those checkmarks for each or a strength calculator. Make forgot password and username section. update user accounts.