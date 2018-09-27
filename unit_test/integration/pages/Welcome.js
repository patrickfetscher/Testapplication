sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press",
  "sap/ui/test/actions/EnterText",
  "my/testapp/pages/Common",
  "sap/ui/test/matchers/AggregationLengthEquals",
  "sap/ui/test/matchers/AggregationFilled",
  "sap/ui/test/matchers/PropertyStrictEquals",
  "sap/ui/test/matchers/AggregationContainsPropertyEqual",
  "sap/ui/test/matchers/Ancestor"
], function (Opa5, Press, EnterText, Common, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, AggregationContainsPropertyEqual, Ancestor) {
  "use strict";

  var sViewName = "Welcome",
      StartAppButton

  Opa5.createPageObjects({
    onTheWelcomePage: {
      baseClass: Common,

      actions: {
        iPressTheStartAppButton:function(){
          return this.waitFor({
            timeout:100,
            pollingInterval:100,
            viewName: sViewName,
            controlType:"sap.m.Button",
            matchers: function(oElement){
              console.log("test")
            },
            actions: function (oElement) {
              if(StartAppButton != undefined && StartAppButton.getMetadata().getName() == "sap.m.Button"){
                oElement.$().trigger("tap")
              }  
            },
          })
        }
      },
      assertions: {
        iShouldSeeTheAppDescription:function(){
          return this.waitFor({
            timeout:100,
            pollingInterval:100,
            controlType: "sap.m.FormattedText",
            viewName:sViewName,
            success:function(oFormattedText){
              Opa5.assert.ok(oFormattedText, "Welcome Page wurde geöffnet")
            },
            errorMessage: "Kein formatted Text gefunden"
          })
        },
        iShouldSeeTheWelcomePage: function(){
          return this.waitFor({
            timeout:30,
            pollingInterval:100,
            controlType: "sap.m.Page",
            viewName: sViewName,
            success:function(oPage){
              Opa5.assert.ok(oPage, "Welcome Page wurde geöffnet")
            },
            errorMessage:"cant see the welcome page"
          })
        },
        iShouldSeeTheStartAppButton:function(){
          return this.waitFor({
            timeout:100,
            pollingInterval:100,
            controlType: "sap.m.Button",
            viewName: sViewName,
            matchers: new sap.ui.test.matchers.PropertyStrictEquals({
              name : "icon",
              value: "sap-icon://home"
        }),
            success: function (oButton) {
              StartAppButton = oButton[0]
              oButton[0].$().trigger("tap")
              Opa5.assert.strictEqual(oButton[0].getProperty("icon"), "sap-icon://home", "I see the Welcome Button");

            },
            errorMessage: "Can't see the StartAppButton Button."
          })
        }
      }
    }
  })
})