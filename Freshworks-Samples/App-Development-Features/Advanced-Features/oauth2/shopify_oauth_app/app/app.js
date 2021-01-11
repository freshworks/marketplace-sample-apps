document.addEventListener("DOMContentLoaded", function () {
  app.initialized().then(function (client) {
    window.client = client;

    client.events.on('app.activated', function () {
      client.request.get('https://<%= oauth_iparams.subdomain %>.myshopify.com/admin/products.json', {
        isOAuth: true,
        headers: {
          'X-Shopify-Access-Token': '<%= access_token %>'
        }
      })
        .then(function (data) {
          let html = '';
          const products = JSON.parse(data.response).products;
          if (products.length == 0) {
            document.getElementById('products').insertAdjacentHTML('beforeend', 'No products');
          }
          else {
            products.map(function (product) {
              html += `<li>${product.title}</li>`;
            });
            document.getElementById('products').insertAdjacentHTML('beforeend', `<ul>${html}</ul>`);
          }
        }, function (err) {
          document.getElementById('products').insertAdjacentHTML('beforeend', 'Error displaying products');
        });
    })
  });
});
