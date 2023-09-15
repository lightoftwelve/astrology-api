// --------------------------------------------
//          FORM EVENT LISTENER
// --------------------------------------------
document.querySelector("form").addEventListener("submit", function (event) {
    const body1 = document.getElementById("body1").value;
    const body2 = document.getElementById("body2").value;

    if (body1 === body2) {
        alert("Please select two different celestial bodies.");
        event.preventDefault();
    }
});