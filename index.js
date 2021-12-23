var plugin = require("./plugin");
var { ParameterType } = require("typedoc");

module.exports.load = function(app) {
  app.options.addDeclaration({ name: 'external-modulemap', short: 'em', type:  ParameterType.Mixed });

  (new plugin.ExternalModuleMapPlugin()).initialize(app);
};

