/**
 * Represents a "contribution" to an ExtensionPoint.
 * <p>
 * See README.md.
 */

// TODO: Refine the docs as we learn more.

module.exports = ExtensionPointContribution;

function ExtensionPointContribution() {
    this.activatorContent = undefined;
    this.activatorContentType = 'blank'; // or 'markup' or 'className'
    this.caption = undefined;
    this.content = undefined;    

    // private properties - do not use
    this._private = {};
    this._private.onshowCallback = undefined;
}

/**
 * Set the activator widget content used to activate the contribution content.
 * <p>
 * If the extension point implementation uses activation widgets (e.g. an icon of some sort), then
 * this widget will be dropped in the extension point activation area and then used to trigger the rendering
 * of the extension point.
 * 
 * @param activatorContent A piece of markup, or just a CSS class name. The rules of what are required
 * here depend on the ExtensionPoint implementation i.e. it could be a button or an icon etc. See
 * 'activatorContentType' property.
 */
ExtensionPointContribution.prototype.setActivator = function(activatorContent) {
    this.activatorContent = activatorContent;
    if (this.activatorContent) {
        this.activatorContent = this.activatorContent.trim();
        if (this.activatorContent.length > 0) {
            if (this.activatorContent.charAt(0) === '<') {
                this.activatorContentType = 'markup';
            } else {
                this.activatorContentType = 'className';
            }
        }
    }
    return this;
};

/**
 * Set caption text for the contribution.
 */
ExtensionPointContribution.prototype.setCaption = function(caption) {
    this.caption = caption;
    return this;
};

/**
 * Set the content to be displayed on activation of the contribution.
 * <p>
 * This can be an "initial" piece of content that is "enriched" by the <code>onShow</code>
 * method e.g. after calling a REST API method.
 * <p>
 * Depending on the ExtensionPoint, activation of this content may be based on user interaction with the
 * "activator widget", or may be from some other mechanism.
 */
ExtensionPointContribution.prototype.setContent = function(content) {
    this.content = content;
    return this;
};

/**
 * Set the callback function to be called after the activation content has been displayed.
 * <p>
 * The on <code>onShow</code> context object will be the DOM element that contains the
 * rendered content that was supplied to the <code>setContent</code> function (or an empty element if 
 * <code>setContent</code> was not called).
 */
ExtensionPointContribution.prototype.onShow = function(onshow) {
    this._private.onshowCallback = onshow;
    return this;
};

/**
 * Trigger the onShow callback, if one was registered.
 * @param containerElement The DOM element containing the content that was shown.
 */
ExtensionPointContribution.prototype.triggerOnShow = function(containerElement) {
    if (this._private.onshowCallback) {
        this._private.onshowCallback.call(containerElement);
    }
    return this;
};