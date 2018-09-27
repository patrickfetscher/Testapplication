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
  "my/testapp/pages/Main",
  "my/testapp/pages/Welcome",
  "com/OPA5test/localService/mockserver",
  
], function (Opa5, Common) {
    "use strict";

  Opa5.extendConfig({
      arrangements: new Common(),
      viewNamespace: "com.OPA5.test.yui5OpaTests.view.",
      timeout:100,
      pollingIntervall:200
  });

  // Require the individual tests and mocked routes
  sap.ui.require([

    "my/testapp/MainJourney",
    ], function() {
      QUnit.start();
      mockserver.init();
  });
});