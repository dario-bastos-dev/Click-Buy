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