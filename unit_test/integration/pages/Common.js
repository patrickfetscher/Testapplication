sap.ui.define([
    "sap/ui/test/Opa5"
  ], function (Opa5) {
    "use strict";

    function getFrameUrl(sHash, sUrlParameters) {
      var sUrl = jQuery.sap.getResourcePath("com/OPA5test/test", ".html");
      sHash = sHash || "";
      if(sUrlParameters != "?H"){
        sUrlParameters = "?sap-ui-language=en" + (sUrlParameters ? "&" + sUrlParameters : "");
      }
      
 
        sHash = "#yui5hcmquest-display";
     

      return sUrl + sUrlParameters + sHash;
    }

    return Opa5.extend("my.testapp.pages.Common", {

      iStartTheApp: function (oOptions, iDelay) {
        //hier kann man den namespace eintragen
        oOptions = oOptions || {};
        if(oOptions == "?H"){
          var sUrlParameters = oOptions
        }else{
          // var sUrlParameters = "serverDelay=50"
        }

        var sUrl = location.href.split("test")[0] + "index_local.html"
        // Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
        this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, sUrlParameters));      
      },

      iLookAtTheScreen: function () {
        return this;
      },

      iPressAButton:function(sViewName, buttontext){
        return this.waitFor({
          controlType: "sap.m.Button",
          viewName: sViewName,
          actions: function (oElement) {
            if(oElement.getProperty("text") == oElement.oPropagatedProperties.oModels.i18n.getResourceBundle().getText(buttontext)) {
              oElement.$().trigger("tap")
            }  
          },
        });
      },
      theBackButtonshouldBeHided:function(sViewName){
        return this.waitFor({
          controlType: "sap.m.Button",
          viewName: sViewName,
          success: function (oElement) {
            var isThereABackButton=false
              for(var prop in oElement){
                if(oElement[prop].getProperty("text") == oElement[prop].oPropagatedProperties.oModels.i18n.getResourceBundle().getText("Back")){
                  isThereABackButton =true
                  Opa5.assert.notStrictEqual(oElement[prop].getProperty("text"), oElement[prop].oPropagatedProperties.oModels.i18n.getResourceBundle().getText("Back"), "There was a Back button")
                }else if(prop >=oElement.length-1 && !isThereABackButton){
                  Opa5.assert.ok(oElement,"There was no Back Button")
                }
                
              }
          },
          errorMessage: "There is a back button."
        });
      }
    });
  }
);
