const { METHODS } = require("http");
const { url } = require("inspector");

// Function validate form camps
const forms = document.querySelectorAll('.needs-validation')

Array.from(forms).forEach(form => {
          form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
            };
      
            form.classList.add('was-validated')
          }, false)


        });

// Jquery

function logout() {
  $.ajax({
    url: '/logout',
    method: 'POST',
    xhrFields: {
        withCredentials: true // Importante para enviar cookies
    },
    success: function(response) {
        window.location.href = '/';
    },
    error: function(error) {
        alert('Erro ao deslogar');
        console.error('Erro ao deslogar:', error);
    }
})
}

$(document).ready( function() {
// Money
  $("input#price").maskMoney({
    prefix: "R$ ",
    thousands: ".",
    decimal: ",",
    allowZero: true
});

// Number
$('input#amount').on('keypress', function(event) {
  // Verifica se o caractere não é um número (0-9)
  if (!/[\d]/.test(event.key)) {
      event.preventDefault();
  }
});

// Opcional: Verificação no evento input para prevenir colagem de letras
$('input#amount').on('input', function() {
  this.value = this.value.replace(/[^0-9]/g, '');
});

// Image preview
$('input#image').on('change', function() {
  const file = this.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const img = $('<img class="preview">').attr('src', e.target.result);
          $('div#image-preview').empty().append(img);
      }
      reader.readAsDataURL(file);
  }
});

})