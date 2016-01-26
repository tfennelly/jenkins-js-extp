/**
 * Represents a UI "part" that contains one or more ExtensionPoint instances. 
 * <p>
 * I guess that, in time, this may morph into a page level construct.
 * <p>
 * See README.md.
 */

// TODO: Refine the docs as we learn more.

module.exports = ExtensionPointContainer;

var ExtensionPoint = require('./ExtensionPoint.js');

function ExtensionPointContainer() {
    // private properties - do not use
    this._private = {};
    this._private.extensionPoints = [];
    this._private.onchangeListeners = [];
}

/**
 * Add an ExtensionPoint.
 * <p>
 * Removal is done by calling <code>this.remove()</code>
 * inside <code>forEach</code>.
 * @param extensionPoint The ExtensionPoint instance.
 */
ExtensionPointContainer.prototype.add = function(extensionPoint) {
    if (extensionPoint instanceof ExtensionPoint) {
        this._private.extensionPoints.push(extensionPoint);
    } else {
        throw '"extensionPoint" must be of type ExtensionPoint.';
    }
};

/**
 * Add an onchange listener.
 * @param listener The listener.
 */
ExtensionPointContainer.prototype.onchange = function(listener) {
    this._private.onchangeListeners.push(listener);
};

/**
 * Iterate the ExtensionPoint instance in this container.
 * <p>
 * The context object (<code>this</code>) provided to the callback call
 * contains a <code>remove</code> function.
 * @param callback The callback to call for each ExtensionPoint in the container.
 * The ExtensionPoint instance is supplied as the first argument to the callback. 
 * @param ofType ExtensionPoint type filter.
 */
ExtensionPointContainer.prototype.forEach = function(callback, ofType) {
    var extensionPointsToRemove = [];
    var extensionPoint;
    
    function callCallback(extensionPoint) {
        callback.call({
            remove: function() {
                extensionPointsToRemove.push(extensionPoint);
            } 
        }, extensionPoint);
    }
    
    for (var i = 0; i < this._private.extensionPoints.length; i++) {
        extensionPoint = this._private.extensionPoints[i];
        if (!ofType || extensionPoint.type === ofType) {
            callCallback(extensionPoint);
        }
    }
    
    if (extensionPointsToRemove.length > 0) {
        var isInRemoveList = function(extensionPoint) {
            for (var ii = 0; ii < extensionPointsToRemove.length; ii++) {
                if (extensionPointsToRemove[ii] === extensionPoint) {
                    return true;
                }
            }
            return false;
        };
        
        // Create a new list, omitting these extension points.
        var newList = [];
        for (var iii = 0; iii < this._private.extensionPoints.length; iii++) {
            extensionPoint = this._private.extensionPoints[iii];
            if (!isInRemoveList(extensionPoint)) {
                newList.push(extensionPoint);
            }
        }
        this._private.extensionPoints = newList;
    }
};

/**
 * Remove all ExtensionPoint instances from this container.
 * @param ofType ExtensionPoint instance type filter (optional).
 */
ExtensionPointContainer.prototype.remove = function(ofType) {
    this.forEach(function(extensionPoint) {
        if (!ofType || extensionPoint.type === ofType) {
            this.remove();
        }
    });
};

/**
 * Notify all onchange listeners. This must be called by the
 * ExtensionPointContainer "owner". Intentionally not calling it
 * from add/remove etc because that might result in a flood of unnecessary
 * activity e.g. on batch add/remove.
 */
ExtensionPointContainer.prototype.notifyOnChange = function() {
    for (var i = 0; i < this._private.onchangeListeners.length; i++) {
        try {
            this._private.onchangeListeners[i].call(this);
        } catch (e) {
            console.warn(e);
        }
    }
};