require('dotenv').config();
const GOOGLE_GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY;

// jQuery UI Datepicker
$("#birthday").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy-mm-dd'
});

// Time dropdowns
for (let i = 0; i <= 23; i++) {
    $('#hour').append(`<option value="${i}">${i}</option>`);
}
for (let i = 0; i <= 59; i++) {
    $('#minute, #second').append(`<option value="${i}">${i}</option>`);
}

// Google Places Autocomplete setup
const autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('location')), {
    types: ['geocode']
}
);
google.maps.event.addListener(autocomplete, 'place_changed', function () {
    const place = autocomplete.getPlace();
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    $("#latitude").val(lat);
    $("#longitude").val(lng);

    // Fetch elevation
    $.getJSON(`https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${GOOGLE_GEOCODING_API_KEY}`, function (data) {
        const elevation = data.results[0].elevation;
        $("#elevation").val(elevation);
    });
});

// Form Submission
$("#userForm").submit(function (e) {
    e.preventDefault();

    const dataObj = {
        name: $("#name").val(),
        gender: $("input[name='gender']:checked").val(),
        date: $("#birthday").val(),
        latitude: $("#latitude").val(),
        longitude: $("#longitude").val(),
        elevation: $("#elevation").val(),
        time: `${$("#hour").val()}:${$("#minute").val()}:${$("#second").val()}`
    };

    console.log(dataObj);

    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObj),
    })
        .then(response => response.json())
        .then(data => {
            window.location.href = "/personalized-astrology-natal-chart";
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});