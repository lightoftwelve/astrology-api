// --------------------------------------------
//       FETCH WELCOME USER DISPLAY
// --------------------------------------------
function fetchUserData() {
    fetch('/api/members/user')
        .then((response) => {
            if (!response.ok) {
                // Handle HTTP error response
                throw new Error(`HTTP error, status = ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const { first_name } = data;
            const message = `Welcome back ${first_name}!`;
            document.getElementById('welcome-message').textContent = message;
        })
        .catch((error) => {
            console.error(error);
        });
}

// Call the function to fetch user data and update the DOM
fetchUserData();