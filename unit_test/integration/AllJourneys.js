jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
jQuery.sap.require("sap.ui.qunit.qunit-coverage");
QUnit.config.autostart = false;

sap.ui.require([
  "sap/ui/test/Opa5",
  "my/testapp/pages/Common",
  "sap/ui/test/opaQunit",
  "my/testapp/pages/App",
  "my/testapp/pages/Start",
  "my/testapp/pages/Main"
  
], function (Opa5, Common) {
    "use strict";

  Opa5.extendConfig({
      arrangements: new Common(),
      viewNamespace: "com.OPA5test.view.",
      // viewName:"App",
      // autowait: true
  });

  // Require the individual tests and mocked routes
  sap.ui.require([
    "my/testapp/StartJourney",
    "my/testapp/MainJourney",
    ], function() {
      QUnit.start();
  });
});