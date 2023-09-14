document.addEventListener('DOMContentLoaded', async function () {
    const toggleButton = document.querySelector('.toggle');
    const navigationLinks = document.querySelector('.links');
    const loginLinks = document.querySelector('.sign-in');

    const signInButton = document.querySelector('#signInButton');
    const signOutButton = document.querySelector('#signOutButton');

    // Function to handle screen size change
    function handleScreenSize() {
        if (window.innerWidth > 991) {
            // For screens wider than 991px (desktop), display the links
            navigationLinks.style.display = 'flex';
            loginLinks.style.display = 'flex';
        } else {
            // For screens 991px or narrower (mobile), hide the links & signin
            navigationLinks.style.display = 'none';
            loginLinks.style.display = 'none';
        }
    }

    // Toggle the menu on button click
    toggleButton.onclick = function () {
        this.classList.toggle('active');
        navigationLinks.classList.toggle('active');

        // Toggle the display property of links
        if (navigationLinks.classList.contains('active')) {
            navigationLinks.style.display = 'flex'; // Display links when active
        } else {
            navigationLinks.style.display = 'none'; // Hide links when not active
            loginLinks.style.display = 'none'; // Hide login icon when not active
        }
    };

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