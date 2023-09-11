document.getElementById('loginBtn').addEventListener('click', function () {
    showPopup(); // Call the showPopup function
});

// Function to show the popup
function showPopup() {
    document.getElementById('loginOverlay').style.display = 'flex';
}

// Function to hide the popup
function hidePopup() {
    document.getElementById('loginOverlay').style.display = 'none';
}

// Call the showPopup function when the "Sign In" button is clicked
document.getElementById('loginBtn').addEventListener('click', showPopup);
document.getElementById('closeButton').addEventListener('click', hidePopup);

// Attach click event handler to the close button
document.getElementById('closeButton').addEventListener('click', hidePopup);