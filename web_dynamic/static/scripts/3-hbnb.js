/**
 * Listens for changes on each input checkbox tag.
 */

$(document).ready(function () {
  const amenities = {};
  $('input:checkbox').click(function () {
    $(this).each(function () {
      if (this.checked) {
        amenities[$(this).data('id')] = $(this).data('name');
      } else {
        delete amenities[$(this).data('id')];
      }
    });
    if (Object.values(amenities).length > 0) {
      $('.amenities h4').text(Object.values(amenities).join(', '));
    } else {
      $('.amenities h4').html('&nbsp');
    }
  });

  $.ajax({
    type: 'GET',
    url: 'http://0.0.0.0:5001/api/v1/status/',
    success: function (data) {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    },
    error: function () {
      alert('Oops! Error getting API status! :(');
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify({}),
    contentType: 'application/json',
    success: function (data) {
      $.each(data, function (index, place) {
        let firstName = null;
        let lastName = null;
        function checkGrammar (number, string) {
          if (number === 1) {
            return `${number} ${string}`;
          } else {
            return `${number} ${string}s`;
          }
        }
        $.ajax({
          url: `http://0.0.0.0:5001/api/v1/users/${place.user_id}`,
          async: false,
          success: function (user) {
            firstName = user.first_name;
            lastName = user.last_name;
          },
          error: function () {
            alert('Error getting user data.');
          }
        });
        // console.log(index + ':' + firstName + lastName + '----->' + place.id);
        $('.places').append(
                    `<article><div class="title_box"><h2>${place.name}</h2><div class="price_by_night">$${place.price_by_night}</div></div><div class="information"><div class="max_guest">${checkGrammar(place.max_guest, 'Guest')}</div><div class="number_rooms">${checkGrammar(place.number_rooms, 'Bedroom')}</div><div class="number_bathrooms">${checkGrammar(place.number_bathrooms, 'Bathroom')}</div></div><div class="user"><b>Owner:</b> ${firstName} ${lastName}</div><div class="description">${place.description}</div></article>`
        );
      });
    },
    error: function () {
      alert('Oops! Error posting data! :(');
    }
  });
});
