// Karma configuration
// Generated on Tue Apr 03 2018 16:24:35 GMT+0200 (Mitteleuropäische Sommerzeit)

module.exports = function(config) {
  config.set({



    

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    browserNoActivityTimeout: 2000000,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['qunit', 'openui5'],

    // list of files / patterns to exclude
    exclude: [
      './End.exe',
      './Gruntfile.js',
      './README.md',
      './start_localserver.cmd',
      './Start.exe',
      './neo-app.json',
      // './node_modules/**',
      './package-lock.json',
      './package.json',
      './.user.project.json',
      './.project.json'
    ],

    // list of files / patterns to load in the browser
    files: [
       { pattern: '**', included: false, served: true, watched: true }
     ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
       'webapp/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  
    reporters: ["progress", "junit", 'coverage'],
    

    // the default configuration
    junitReporter: {
       outputFile: 'testResult.xml',
    },

    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type: 'html', subdir: 'report-html'},
        { type: 'cobertura', subdir: '.', file: 'cobertura.xml' }
      ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222',
        ],
      },
      Chromesmall:{
        base: 'Chrome',
        flags:[
          '--headless',
          '--window-size=412,732',
          '--disable-gpu',
          '--remote-debugging-port=9223'
        ]
      }
    },


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless', 'Chromesmall', 'IE'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    
    openui5:{
      path: 'https://openui5.hana.ondemand.com/resources/sap-ui-core.js'
    },

    client: {
      openui5: {
        config: {
          theme: 'sap_belize',
          language: 'EN',
          resourceroots: {
            "com/OPA5test/": "./webapp/test/",
            "com/OPA5test/model/":"./webapp/model/",
            "com/OPA5test/test": "base/webapp/test/flpSandboxMockServer",
            "my/testapp" : "base/webapp/test/integration/"
          }
        },
        tests:['my/testapp/AllJourneysphantom']
      }
    },
  })
}
