(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const gaMeasurementId = urlParams.get('gaMeasurementId');

  const encodeUriComponent = encodeURIComponent;
  const document = window.document;
  const console = window.console;
  const setTimeout = window.setTimeout;

  // Função para obter o Client ID
  function getClientId(callback, failureCallback) {
    if (typeof window.gtag === 'function') {
      window.gtag('get', gaMeasurementId, 'client_id', callback);
    } else {
      failureCallback();
    }
  }

  // Função para atualizar os links do WhatsApp
  function updateWhatsAppLinks(clientId) {
    const pageTitle = document.title;
    const message = "Oi, estou vendo " + pageTitle + " e gostaria de saber mais (ID: #" + clientId + ")";
    const encodedMessage = encodeUriComponent(message);

    const links = document.querySelectorAll('a[href*="api.whatsapp.com"], a[href*="wa.me"]');
    links.forEach(link => {
      let href = link.getAttribute('href');
      if (href) {
        if (href.includes('?')) {
          href += "&text=" + encodedMessage;
        } else {
          href += "?text=" + encodedMessage;
        }
        link.setAttribute('href', href);
      }
    });

    // Chamar data.gtmOnSuccess() aqui é opcional, já que ele não está disponível no script externo.
    console.log("WhatsApp links updated successfully.");
  }

  // Verifica se o gtag.js está carregado antes de executar a função
  function checkGtagLoaded() {
    if (typeof window.gtag === 'function') {
      getClientId(
        clientId => updateWhatsAppLinks(clientId),
        () => console.error('API gtag não disponível')
      );
    } else {
      setTimeout(checkGtagLoaded, 100);
    }
  }

  // Executa a função para verificar se o gtag.js está carregado
  checkGtagLoaded();
})();
