/**
 * Represents an actual "point" in the UI to which "contributions" can be made.
 * <p>
 * See README.md.
 */

// TODO: Refine the docs as we learn more.

module.exports = ExtensionPoint;

var ExtensionPointContribution = require('./ExtensionPointContribution.js');

/**
 * Create an ExtensionPoint instance.
 * @param type The type.
 * @param id A unique ID for the ExtensionPoint.
 * @param dock Dock element (DOM element).
 * @constructor
 */
function ExtensionPoint(type, id, dock) {
    if (!type) {
        throw 'You must define an ExtensionPoint "type".';
    }
    if (!id) { // I hope making this a requirement will not be an issue.
        throw 'You must define an ExtensionPoint "id".';
    }
    this.type = type;
    this.id = id;
    this.dock = dock;

    // private properties - do not use
    this._private = {};
    this._private.oncontributeCallback = undefined;
    this._private.contributions = [];
}

/**
 * Contribute to the Extension Point.
 * <p>
 * An instance of <code>ExtensionPointContribution</code>.
 */
ExtensionPoint.prototype.contribute = function(contribution) {
    if (contribution instanceof ExtensionPointContribution) {
        this._private.contributions.push(contribution);                
    } else {
        throw '"contribution" must be of type ExtensionPointContribution.';
    }
    
    // Fire the oncontribute callback if one was supplied.
    var extensionPoint = this;
    if (extensionPoint._private.oncontributeCallback) {
        extensionPoint._private.oncontributeCallback.call(contribution);
    } 
};

/**
 * Set an contribution registration listener.
 * @param listener Listener function for when a contribution is made via
 * the contribute function.
 */
ExtensionPoint.prototype.oncontribute = function(listener) {
    this._private.oncontributeCallback = listener;
};