document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.querySelector('.toggle');
    const navigationLinks = document.querySelector('.links');
    const loginLinks = document.querySelector('.sign-in');

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

    // Initial setup based on screen size
    handleScreenSize();

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

    // Listen for window resize events and update the menu accordingly
    window.addEventListener('resize', handleScreenSize);
});