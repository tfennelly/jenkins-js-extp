var jsTest = require('jenkins-js-test');

var ExtensionPointContainer = jsTest.requireSrcModule('../js/ExtensionPointContainer.js');
var ExtensionPoint = jsTest.requireSrcModule('../js/ExtensionPoint.js');
var ExtensionPointContribution = jsTest.requireSrcModule('../js/ExtensionPointContribution.js');

describe("extension/ExtensionPoint-spec", function () {

    it("- test ExtensionPointContainer iterate and filter", function () {
        var extensionPointContainer = new ExtensionPointContainer();
        
        // Add some extension points of different types.
        extensionPointContainer.add(new ExtensionPoint('jenkins.workflow.run', '1'));
        extensionPointContainer.add(new ExtensionPoint('jenkins.workflow.run', '2'));
        extensionPointContainer.add(new ExtensionPoint('jenkins.workflow.stage', '1:1'));
        extensionPointContainer.add(new ExtensionPoint('jenkins.workflow.stage', '1:2'));
        
        // No filter
        var ids = [];
        extensionPointContainer.forEach(function(extensionPoint) {
            ids.push(extensionPoint.id);
        });
        expect('1,2,1:1,1:2').toBe(ids.toString());
        
        // With filter
        ids = [];
        extensionPointContainer.forEach(function(extensionPoint) {
            ids.push(extensionPoint.id);
        }, 'jenkins.workflow.stage');
        expect('1:1,1:2').toBe(ids.toString());
    });

    it("- test ExtensionPointContainer remove", function () {
        var extensionPointContainer = new ExtensionPointContainer();
        
        // Add some extension points of different types.
        extensionPointContainer.add(new ExtensionPoint('jenkins.workflow.run', '1'));
        extensionPointContainer.add(new ExtensionPoint('jenkins.workflow.run', '2'));
        extensionPointContainer.add(new ExtensionPoint('jenkins.workflow.stage', '1:1'));
        extensionPointContainer.add(new ExtensionPoint('jenkins.workflow.stage', '1:2'));
        
        // Make sure they're all there ...
        var ids = [];
        extensionPointContainer.forEach(function(extensionPoint) {
            ids.push(extensionPoint.id);
        });
        expect('1,2,1:1,1:2').toBe(ids.toString());
        
        // remove one of them ...
        extensionPointContainer.forEach(function(extensionPoint) {
            if (extensionPoint.id === '1:1') {
                this.remove();
            }
        });
        
        // Iterate again and check that 1:1 was in fact removed
        ids = [];
        extensionPointContainer.forEach(function(extensionPoint) {
            ids.push(extensionPoint.id);
        });
        expect('1,2,1:2').toBe(ids.toString());        
    });

    it("- test ExtensionPointContribution activation", function (done) {
        jsTest.onPage(function () {
            var $ = require('jquery-detached').getJQuery();
            var $dock = $('.dock');
            var extensionPoint = new ExtensionPoint('jenkins.workflow.run', '5', $dock.get());

            expect(extensionPoint.type).toBe('jenkins.workflow.run');
            expect(extensionPoint.id).toBe('5');
            
            // The following code would be in the ExtensionPoint "host" plugin
            extensionPoint.oncontribute(function() {
                var theContribution = this;
                
                expect(theContribution.activatorContent).toBe('hello-world-widget');
                expect(theContribution.activatorContentType).toBe('className');
                
                // Add the activator to the dock.
                var activatorDock = $(extensionPoint.dock);
                var activatorWidget = $('<span>');

                // Add the contribution className to the widget, allow the use of
                // CSS to decorate the widget with a BG image, or whatever.
                activatorWidget.addClass(theContribution.activatorContent);
                
                // Add the activation widget to the dock area
                activatorDock.append(activatorWidget);
                
                // Use click events on the widget to activate the contribution
                // content, placing it into the 'content' area of the page.
                activatorWidget.click(function() {
                    var contentContainer = $('.content');
                    // Add the content and trigger the onshow method, giving the
                    // extension point a chance to enrich the displayed content e.g. 
                    // by making a REST API call etc. 
                    contentContainer.append(theContribution.content);
                    theContribution.show(contentContainer.get());
                });
                
                // Mimic a user clicking on the widget
                activatorWidget.click();                
            });
                
            // The following code would be in plugin making the contribution
            extensionPoint.contribute(
                new ExtensionPointContribution()
                    .setActivator('hello-world-widget')
                    .setContent('<div>Hello World</div>')
                    .onShow(function() {
                        // The user has clicked on the widget and the extension contrib
                        // content has been displayed
                        var containerElement = $(this);
                        expect(containerElement.html()).toBe('<div>Hello World</div>');
                        done();
                    })
            );
        }, '<div><div class="dock"></div><div class="content"></div></div>');
    });
});
