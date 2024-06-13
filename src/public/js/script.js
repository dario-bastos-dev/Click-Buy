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
  $("#price").maskMoney({
    prefix: "R$ ",
    thousands: "",
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

// Incremento e decremento do produto
$('.btn-increment').click(function() {
  var $input = $(this).closest('.input-group').find('.quantity-input');
  var val = parseInt($input.val());
  if (!isNaN(val)) {
      $input.val(val + 1);
  }
});

$('.btn-decrement').click(function() {
  var $input = $(this).closest('.input-group').find('.quantity-input');
  var val = parseInt($input.val());
  if (!isNaN(val) && val > 1) {
      $input.val(val - 1);
  }
});

$('.quantity-input').on('input', function() {
  var val = $(this).val();
  if (!/^\d*$/.test(val)) {
      $(this).val(val.replace(/[^\d]/g, ''));
  }
});

})

// JavaScript prórpio

// Adicoinar no carrinho --
document.addEventListener('DOMContentLoaded', function() {
  const addToCartButtons = document.querySelectorAll('.add-cart');

  addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
          const id = button.getAttribute('data-id');
          const quant = button.getAttribute('data-quant');

          console.log('ID:', id); // Para debug
          console.log('Quant:', quant); // Para debug

          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/add-carrinho');
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.onload = function() {
            if (xhr.status === 200) {
                // Redireciona a página após adicionar ao carrinho
                window.location.reload();
            } else {
                alert('Erro ao adicionar produto ao carrinho.');
            }
          }

          xhr.send(JSON.stringify({ id: id, quant: quant, origin: "inicio" }));
      });
  });
});