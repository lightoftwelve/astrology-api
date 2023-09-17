// ------------------------------------------------------------
//        HANDLES ADDRESS SEARCH & AUTOCOMPLETE CALLS
// ------------------------------------------------------------
// jQuery UI Datepicker
$("#birthday").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy-mm-dd',
    yearRange: "-100:+0"
});

// Time dropdowns
for (let i = 0; i <= 23; i++) {
    $('#hour').append(`<option value="${i}">${i}</option>`);
}
for (let i = 0; i <= 59; i++) {
    $('#minute, #second').append(`<option value="${i}">${i}</option>`);
}

// Initialize the autocomplete service
function initAutocomplete() {

    const autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('location')), {
        types: ['geocode']
    });

    // Event listener for when a user selects a place
    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        $("#latitude").val(lat);
        $("#longitude").val(lng);

        // Send the coordinates to the server
        // $.post('/api/coords/get-coords', { lat, lng }, function (data) {
        //     if (data && data.elevation) {
        //         $("#elevation").val(data.elevation);
        //     }
        // });
        $.ajax({
            url: '/api/coords/get-coords',
            type: 'POST',
            data: JSON.stringify({ lat, lng }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data && data.elevation) {
                    $("#elevation").val(data.elevation);
                }
            }
        });

    });
}

// Form Submission to generate the birthchart
$("#bc_userForm").submit(function (e) {
    e.preventDefault();

    const dataObj = {
        name: $("#name").val(),
        gender: $("input[name='gender']:checked").val(),
        date: $("#birthday").val(),
        latitude: $("#latitude").val(),
        longitude: $("#longitude").val(),
        elevation: $("#elevation").val(),
        time: `${$("#hour").val().padStart(2, '0')}:${$("#minute").val().padStart(2, '0')}:${$("#second").val().padStart(2, '0')}`
    };

    fetch('api/celestial-routes/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObj),
    })
        .then(response => response.json())
        .then(data => {
            window.location.href = "astrology/generate-personalized-astrology-natal-chart";
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});