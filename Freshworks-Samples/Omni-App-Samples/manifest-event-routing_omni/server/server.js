exports = {

  events: [
    { event: 'onContactCreate', callback: 'onContactCreateHandler' }
  ],

  // args is a JSON block containing the payload information.
  // args['iparam'] will contain the installation parameter values.
  onContactCreateHandler: function(args) {
    console.log(args);
  }
};
