/**
 * Listens for changes on each input checkbox tag.
 */

$(document).ready(function () {
    const amenities = {};
    const states = {};
    const cities = {};

    
    $('.amenities input:checkbox').click(function () {
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
        parseApiData(data);
      },
      error: function () {
        alert('Oops! Error posting data! :(');
      }
    });
  
    $('button').click(function () {
      $.ajax({
        type: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        data: JSON.stringify({ amenities: Object.keys(amenities) }),
        contentType: 'application/json',
        success: function (data) {
          $('.places').empty();
          parseApiData(data);
          console.log(data);
        },
        error: function () {
          alert('Oops! Error posting data! :(');
        }
      });
    });
  
    function parseApiData (data) {
      $.each(data, function (index, place) {
        let firstName = null;
        let lastName = null;
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
        $('.places').append(
                  `<article><div class="title_box"><h2>${place.name}</h2><div class="price_by_night">$${place.price_by_night}</div></div><div class="information"><div class="max_guest">${checkGrammar(place.max_guest, 'Guest')}</div><div class="number_rooms">${checkGrammar(place.number_rooms, 'Bedroom')}</div><div class="number_bathrooms">${checkGrammar(place.number_bathrooms, 'Bathroom')}</div></div><div class="user"><b>Owner:</b> ${firstName} ${lastName}</div><div class="description">${place.description}</div></article>`
        );
      });
    }
  
    function checkGrammar (number, string) {
      if (number === 1) {
        return `${number} ${string}`;
      } else {
        return `${number} ${string}s`;
      }
    }


    $('.locations h2 input:checkbox').click(function () {
        $(this).each(function () {
            //console.log(this);
            let stateId = $(this).data('id');
            let state_cities = $(`*[data-stateId=${stateId}]`);
            if (this.checked) {
                states[stateId] = $(this).data('name');
                state_cities.prop('checked', true);
            }
            else {
                delete states[stateId];
                console.log(state_cities);
                state_cities.each(function () {
                  if (this.checked) {
                    cities[$(this).data('id')] = $(this).data('name');
                  }
                });
            }
            console.log(states);
            console.log(cities);
        })
    });


    $(".locations input[data-type=city]").click(function () {
        if (this.checked) {
            cities[$(this).data("id")] = $(this).data("name");
        }
        else {
          let stateId = $(this).data("stateid");
            delete cities[$(this).data("id")];
            $(`.locations h2 input[data-id=${stateId}]`).prop('checked', false);
            delete states[stateId];
            console.log(states);
        }
        console.log(cities);
    })
  });
  