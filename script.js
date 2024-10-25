$(document).ready(function() {
  var $form = $('form#signup-form');
  var url = 'https://script.google.com/macros/s/AKfycbwEAzC-gvumGtkZJ2uRujlsd589gVJGdlBz6TWFEGnQn28WWxRRP9j3PazwvffYU91Gjg/exec';

  $form.on('submit', function(e) {
    e.preventDefault();

    const el = $(this);
    const submitButton = $(el).find('#submit-button');

    var jqxhr = $.ajax({
      url: url,
      method: "GET",
      data: $form.serialize(),
      beforeSend: function() {
        // console.log($form.serialize());
        submitButton.attr('disabled', true);
        submitButton.text('sending....');
      },
      success: function(data) {
        console.log(data);

        swal("Thank you for your feedback!", "", "success");
        submitButton.attr('disabled', false);
        submitButton.text('Submit');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error("Error: " + textStatus, errorThrown);
        alert("There was an error submitting your data. Please try again.");
        submitButton.attr('disabled', false);
        submitButton.text('Submit');
      }
    });
  });
});


