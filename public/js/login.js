document.addEventListener('DOMContentLoaded', async function () {
    const signInButton = document.querySelector('#signInButton');
    const signInText = document.querySelector('#signInText');

    // Function to check if the user is logged in and changes the button accordingly
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

    // Event listener for the "SIGN IN" button
    signInButton.addEventListener('click', async () => {

        // If the user is logged in, initiate the logout process
        if (signInText.textContent === 'SIGN OUT') {
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
        } else {
            window.location.href = '/login'; // If the user is not logged in, just redirect to the login page
        }
    });

    checkLoggedIn(); // Check the login status when the page loads
});