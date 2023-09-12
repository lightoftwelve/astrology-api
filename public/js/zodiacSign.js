$(document).ready(function () {
    // Initialize the date picker
    $("#birthdate").datepicker();

    // Handle the click event for the "Calculate Zodiac Sign" button
    $("#calculateButton").click(function (e) {
        e.preventDefault(); // prevent the default form submit behavior

        const birthdate = $("#birthdate").val();

        // Perform a Fetch request to calculate the zodiac sign
        fetch('/zodiac-sign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: birthdate }),
        })
            .then(response => response.json())
            .then(data => {
                $("#result").html("Your zodiac sign is " + data.zodiacSignData.sign);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
