// ----------------------------------------------------------------------
//          HANDLES HEADER LOGIN, LOGOUT & SCREEN RESPONSIVENESS
// ----------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    const navigationLinks = document.querySelector('.links');
    const loginLinks = document.querySelector('.sign-in');
    const signInButton = document.querySelector('#signInButton');

    // Close and open the menu in mobile
    document.querySelector('.toggle').addEventListener('click', function () {
        this.classList.toggle('active');
        navigationLinks.classList.toggle('open');

        if (navigationLinks.classList.contains('open')) {
            navigationLinks.style.display = 'flex';
        } else {
            navigationLinks.style.display = 'none';
            loginLinks.style.display = 'none';
        }
    });

    // Close the menu by clicking outside or on the close button in mobile
    navigationLinks.addEventListener('click', function (event) {
        if (event.target === this || event.target.classList.contains('close-menu')) {
            navigationLinks.classList.remove('open');
            navigationLinks.style.display = 'none';
            document.querySelector('.toggle').classList.remove('active');
        }
    });

    // Handles header links when desktop and mobile
    function handleScreenSize() {
        if (window.innerWidth > 991) {
            navigationLinks.style.display = 'flex';
            loginLinks.style.display = 'flex';
        } else {
            navigationLinks.style.display = 'none';
            loginLinks.style.display = 'none';
        }
    }

    // Checks if the user is logged in and changes the signin / signout wording in header
    const checkLoggedIn = async () => {
        try {
            const response = await fetch('/api/members/status');
            if (response.ok) {
                const data = await response.json();
                if (data.loggedIn) {
                    signInText.textContent = 'SIGN OUT';
                } else {
                    signInText.textContent = 'SIGN IN';
                }
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };

    // Handles logout ability in header & redirects to login page after signout
    if (signInText.textContent = 'SIGN OUT') {
        // Event listener for the "SIGN IN" button
        signInText.addEventListener('click', async () => {
            try {
                // Send a POST request to log the user out
                const response = await fetch('/api/members/logout', {
                    method: 'POST',
                });

                if (response.ok) {
                    window.location.href = '/login'; // Redirect to the login page after logout
                } else {
                    alert('Use the signin button below to sign in.');
                }
            } catch (error) {
                console.error('Error logging out:', error);
            }
        });
    }
    if (signInButton) {
        signInButton.addEventListener('click', async () => {
            window.location.href = '/login';
        })
    }

    // Initial setup
    handleScreenSize();
    checkLoggedIn();

    // Listen for window resize events
    window.addEventListener('resize', handleScreenSize);
});