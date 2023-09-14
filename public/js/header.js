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
//     const loginLinks = document.querySelector('.sign-in');

  

//     $(".toggle").click(function () {
//         $(".links").toggleClass("open");
//         $(this).toggleClass("active");
//     });

//     // Close menu when clicking outside of the actual menu content
//     $(".links").click(function (event) {
//         // Check if the clicked target is the .links container itself, and not a child
//         if (event.target === this) {
//             $(".links").removeClass("open");
//             $(".toggle").removeClass("active");
//         }
//     });

//     // Close menu
//     $(".close-menu").click(function () {
//         $(".links").removeClass("open");
//         $(".toggle").removeClass("active");
//     });

//     // Function to handle screen size change
//     function handleScreenSize() {
//         if (window.innerWidth > 991) {
//             // For screens wider than 991px (desktop), display the links
//             navigationLinks.style.display = 'flex';
//             loginLinks.style.display = 'flex';
//         } else {
//             // For screens 991px or narrower (mobile), hide the links & signin
//             navigationLinks.style.display = 'none';
//             loginLinks.style.display = 'none';
//         }
//     }

//     // Toggle the menu on button click
//     toggleButton.onclick = function () {
//         this.classList.toggle('active');
//         navigationLinks.classList.toggle('active');

//         // Toggle the display property of links
//         if (navigationLinks.classList.contains('active')) {
//             navigationLinks.style.display = 'flex'; // Display links when active
//         } else {
//             navigationLinks.style.display = 'none'; // Hide links when not active
//             loginLinks.style.display = 'none'; // Hide login icon when not active
//         }
//     };

//     const checkLoggedIn = async () => {
//         try {
//             const response = await fetch('/api/members/status');
//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.loggedIn) {
//                     signInText.textContent = 'SIGN OUT';
//                 } else {
//                     signInText.textContent = 'SIGN IN';
//                 }
//             }
//         } catch (error) {
//             console.error('Error checking login status:', error);
//         }
//     };

//     if (signInText.textContent = 'SIGN OUT') {
//         // Event listener for the "SIGN IN" button
//         signInText.addEventListener('click', async () => {
//             try {
//                 // Send a POST request to log the user out
//                 const response = await fetch('/api/members/logout', {
//                     method: 'POST',
//                 });

//                 if (response.ok) {
//                     window.location.href = '/login'; // Redirect to the login page after logout
//                 } else {
//                     alert('Logout failed. Please try again.');
//                 }
//             } catch (error) {
//                 console.error('Error logging out:', error);
//             }
//         });
//     }
//     if (signInButton) {
//         signInButton.addEventListener('click', async () => {
//             window.location.href = '/login';
//         })
//     }

//     // Initial setup
//     handleScreenSize();
//     checkLoggedIn();

//     // Listen for window resize events (from header.js)
//     window.addEventListener('resize', handleScreenSize);
// });