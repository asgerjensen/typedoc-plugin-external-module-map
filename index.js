var plugin = require("./plugin").ExternalModuleMapPlugin;
module.exports.load = function(app) {
  app.options.addDeclaration({ name: 'external-modulemap', short: 'em' });

  (new plugin).initialize(app);
};

