var plugin = require("./plugin");
module.exports = function(PluginHost) {
  var app = PluginHost.owner;


  app.options.addDeclaration({ name: 'external-modulemap', short: 'em' });

  app.converter.addComponent('external-module-map', plugin.ExternalModuleMapPlugin);
};

