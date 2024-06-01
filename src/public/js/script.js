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

// Check session
document.addEventListener('DOMContentLoaded', function() {
  // Função para verificar a sessão
  function verificarSessao() {
      fetch('/session', {
          method: 'GET',
          credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
          if (data.isLoggedIn) {
              window.location.href = '/Inicio'; // Redireciona para a página inicial
          }
      })
      .catch(error => {
          console.error('Erro ao verificar a sessão:', error);
      });
  }

  // Espera pelo carregamento do elemento específico
  const elementoEspecifico = document.getElementById('login');

  if (elementoEspecifico) {
      // Verifica a sessão quando o elemento está presente na página
      verificarSessao();
  }
});

// Jquery mask
$(document).ready( function() {
// Money
  $("input#value").maskMoney({
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