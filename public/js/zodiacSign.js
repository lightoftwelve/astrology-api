$(document).ready(function () {
    // Initialize the date picker
    $("#birthdate").datepicker();

    // Handle the click event for the "Calculate Zodiac Sign" button
    $("#calculateButton").click(function () {
        const birthdate = $("#birthdate").val();

        // Perform an AJAX request to calculate the zodiac sign
        $.post("/zodiac-sign", { date: birthdate }, function (data) {
            $("#result").html("Your zodiac sign is " + data.zodiacSign);
        });
    });
});
