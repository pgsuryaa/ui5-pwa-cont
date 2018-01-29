sap.ui.define(
    ['sap/ui/core/Control'],
    function(Control) {
     
        return Control.extend("zpwa_test.util.CustomMessageRight",{
            metadata: {
                properties: {
                    width: {
                        type: "sap.ui.core.CSSSize", //this is optional, but it helps prevent errors in your code by enforcing a type
                        defaultValue: "auto" //this is also optional, but recommended, as it prevents your properties being null
                    },
                    height: {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "auto"
                    },
                    background: {
                        type: "sap.ui.core.CSSColor",
                        defaultValue: "#ffffff"
                    },
                    margin: {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "5px"
                    }
                },
                aggregations: {
                    content: {
                        type: "sap.ui.core.Control"
                    }
                },
                defaultAggregation: "content",
            },
         
            init: function() {
                //initialisation code, in this case, ensure css is imported
                //var libraryPath = jQuery.sap.getModulePath("sap.ui.demo.myFiori.util"); //get the server location of the ui library
                jQuery.sap.includeStyleSheet("https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/css/materialize.min.css"); //specify the css path relative from the ui folder
            },
         
            renderer: function(oRm,oControl){
                //first up, render a div for the ShadowBox
                oRm.write("<div");
             
                //add this controls style class (plus any additional ones the developer has specified)
                oRm.addClass("clearfix right-align right card-panel blue-text text-darken-2 hoverable textClass");
                oRm.writeClasses(oControl);
             
                //render width & height & background properties
                oRm.write(" style=\"width: " + oControl.getWidth()
                                + "; height: " + oControl.getHeight()
                                + "; background-color: " + oControl.getBackground()
                                + "; margin: " + oControl.getMargin()
                                + "\"");
             
                //next, render the control information, this handles your sId (you must do this for your control to be properly tracked by ui5).
                oRm.writeControlData(oControl);
                oRm.write(">");
             
                //next, iterate over the content aggregation, and call the renderer for each control
                $(oControl.getContent()).each(function(){
                    oRm.renderControl(this);
                });
             
                //and obviously, close off our div
                oRm.write("</div>");
            },
         
            onAfterRendering: function(arguments) {
                if(sap.ui.core.Control.prototype.onAfterRendering) {
                 sap.ui.core.Control.prototype.onAfterRendering.apply(this,arguments);
                }
            },
         
        });
     
    }
);