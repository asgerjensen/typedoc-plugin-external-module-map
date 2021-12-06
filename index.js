var plugin = require("./plugin");
module.exports.load = function(app) {
  app.options.addDeclaration({ name: 'external-modulemap', short: 'em' });

  (new plugin.ExternalModuleMapPlugin()).initialize(app);
};

