/**
 * Expose the top level API type constructors.
 */

exports.ExtensionPointContainer = require('./js/ExtensionPointContainer.js');
exports.ExtensionPoint = require('./js/ExtensionPoint.js');
exports.ExtensionPointContribution = require('./js/ExtensionPointContribution.js');

exports.extensionPointContainer = new exports.ExtensionPointContainer();