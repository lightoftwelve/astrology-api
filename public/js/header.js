document.addEventListener('DOMContentLoaded', async function () {
    const navigationLinks = document.querySelector('.links');
    const loginLinks = document.querySelector('.sign-in');

    const signInButton = document.querySelector('#signInButton');
    const signOutButton = document.querySelector('#signOutButton');

    // Close and open the menu using only vanilla JS
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

    // Close the menu by clicking outside or on the close button using vanilla JS
    navigationLinks.addEventListener('click', function (event) {
        if (event.target === this || event.target.classList.contains('close-menu')) {
            navigationLinks.classList.remove('open');
            navigationLinks.style.display = 'none';
            document.querySelector('.toggle').classList.remove('active');
        }
    });

    function handleScreenSize() {
        if (window.innerWidth > 991) {
            navigationLinks.style.display = 'flex';
            loginLinks.style.display = 'flex';
        } else {
            navigationLinks.style.display = 'none';
            loginLinks.style.display = 'none';
        }
    }

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
                    alert('Logout failed. Please try again.');
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

    // Listen for window resize events (from header.js)
    window.addEventListener('resize', handleScreenSize);
});