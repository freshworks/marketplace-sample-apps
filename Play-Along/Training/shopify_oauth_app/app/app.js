$(document).ready(function() {
  app.initialized().then(function(client) {
    window.client = client;

    client.events.on('app.activated', function() {
      client.request.get('https://<%= oauth_iparams.subdomain %>.myshopify.com/admin/products.json', {
        isOAuth: true,
        headers: {
          'X-Shopify-Access-Token': '<%= access_token %>'
        }
      })
      .then(function(data) {
        let html = '';
        const products = JSON.parse(data.response).products;
        if (products.length == 0) {
          $('#products').find('#products').append('No products');
        }
        else {
          products.map(function(product) {
            html += `<li>${product.title}</li>`;
          });
          $('#products').append(`<ul>${html}</ul>`);
        }
      }, function(err) {
        $('#products').append('Error displaying products');
      });
    })
  });
});
