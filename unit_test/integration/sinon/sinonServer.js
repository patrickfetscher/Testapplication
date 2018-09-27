/* global sinon */

// Start the sinon.js fake server
var oServer = sinon.fakeServer.create();

oServer.autoRespond = true;

// Only those requests, which are directed to the SWA models, should be mocked.
oServer.xhr.useFilters = true;
oServer.xhr.addFilter(function(sMethod, sUrl) {

    "use strict";

    // whenever the regex returns true the request will not faked
    return (!sUrl.match(/\/api\/v1\//));
});