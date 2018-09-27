sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "my/testapp/pages/Common",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "sap/ui/test/matchers/AggregationFilled",
    "sap/ui/test/matchers/PropertyStrictEquals",

  ], function (Opa5, Press, EnterText, Common, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals) {
    "use strict";

    var sViewName = "Start",
      sSomethingThatCannotBeFound = "*#-Q@@||",
      iGroupingBoundary = 100;


    Opa5.createPageObjects({
      onTheStartPage: {
        baseClass: Common,
        actions: {

          iPressTheBeginButton:function(){
            return this.waitFor({
              controlType: "sap.m.Button",
              viewName: sViewName,
              actions: function (oElement) {
                if(oElement.getProperty("text") == oElement.oPropagatedProperties.oModels.i18n.getResourceBundle().getText("Begin")) {
                  oElement.$().trigger("tap")
                }  
              },
            });
          },

          iEnterAValidUsername:function(){
            return this.waitFor({
              id: "username",
              viewName: sViewName,
              actions: [new EnterText({text: "Maier"})],
            });
          },

          iEnterAValidPin:function(){
            return this.waitFor({
              id: "pin",
              viewName: sViewName,
              actions: [new EnterText({text: "80022222"})],
            });
          }
        },

        assertions: {

        thereShouldBeTextInThere: function(Text){
          return this.waitFor({
            controlType: "sap.m.FormattedText",
            viewName: sViewName,
            matchers : function(oElement){
              if(oElement.getProperty("htmlText") == oElement.oPropagatedProperties.oModels.i18n.getResourceBundle().getText(Text)) {
                return true
              }else{
                return false;
              }
            },
              success: function(oElement) {
                  ok(oElement, "Found the right Welcome text");
              },
              errorMessage: "Could not find any Welcome text at view " + sViewName
          });
        },

          iShouldSeeTheWelcomeText: function (type) {
            return this.waitFor({
              controlType: "sap.m.FormattedText",
              viewName: sViewName,
              success: function (oElement) {
                Opa5.assert.ok(oElement,"Found the Welcome FormattedText")
                
              },
              errorMessage: "Can't see the Start FormattedText."
            });
          },

          theHeaderText: function(Content){
            return this.waitFor({
              controlType: "sap.m.Text",
              viewName: sViewName,
              matchers : function(oElement){
                if(oElement.getText("text") == oElement.oPropagatedProperties.oModels.i18n.getResourceBundle().getText("LeaveQuestionaire")) {
                  return true
                }else{
                  return false;
                }
              },
             
            success:function(oElement){
              ok(oElement,"Header Text " + oElement[0].getText() + " is set right")
            },
              errorMessage: "Header Text is wrong"
            });
          },

          theUserNameLabel: function(){
            return this.waitFor({
              controlType: "sap.m.Label",
              viewName: sViewName,
              success: function (oElement) {
                Opa5.assert.ok(oElement,"Found the Label for Username Input Field")
                
              },
              errorMessage: "Can't see the Start Label username."
            });
          },

 
          theUserNameInputField: function () {
            return this.waitFor({
              id: "username",
              viewName: sViewName,
              success: function (oList) {
                Opa5.assert.ok(oList, "Found the Input Field for the Username ");
              },
              errorMessage: "Username Input Field is not displayed."
            });
          },

          thePinLabel: function(){
            return this.waitFor({
              controlType: "sap.m.Label",
              viewName: sViewName,
              success: function (oElement) {
                Opa5.assert.ok(oElement, "Found the Label for Pin Input Field")
                
              },
              errorMessage: "Can't see the Start Label pin."
            });
          },

          thePinInputField: function(){
            return this.waitFor({
              id: "pin",
              viewName: sViewName,
              success: function (oList) {
                Opa5.assert.ok(oList, "Found the Input Field for the Pin ");
              },
              errorMessage: "Pin Input Field is not displayed."
            });
          },

          theBeginButton:function(){
            return this.waitFor({
              controlType: "sap.m.Button",
              viewName: sViewName,
              matchers : function(oElement){
                if(oElement.getProperty("text") == oElement.oPropagatedProperties.oModels.i18n.getResourceBundle().getText("Begin")) {
                  return true
                }else{
                  return false;
                }
              },
                success: function(oElement) {
                    ok(oElement, "Found the Begin Button");
                },
                errorMessage: "Could not find the Begin Button"

            })
          },

          iShouldSeeTheAlertBox: function(){
                return this.waitFor({
                  pollingInterval : 100,
                  viewName : sViewName,
                  check : function(oElement){
                    return !!sap.ui.test.Opa5.getJQuery()(".sapMMessageToast").length;
 
                  },
                  success : function(oElement){
                          ok (oElement, "Messagebox created");    
                  },
                });
                errorMessage: "no Messagebox displayed"
          },
          iShouldNavigateToMain:function(){
            return this.waitFor({
              controlType: "sap.m.Page",
              viewName: "Main",
              success : function(oElement){
                ok (oElement, "Navigation to Main successful");    
              },
            })
            errorMessage: "No Navigation"
          }
        }
      }
    });
  }
);
