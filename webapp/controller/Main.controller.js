sap.ui.define([
	"com/OPA5test/controller/BaseController",
	"com/OPA5test/util/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text'
], function(BaseController, formatter, JSONModel, Filter, FilterOperator, Dialog, Button, Text) {
	"use strict";
	var thatMain = this,
		questionCount,
		questionlength,  /*hier muss ausgelesen werden*/
		propglob = 0,
		responsibility = "E",
		viewSummary = [],
		answers = [],
		questionBegin = 1
	
	return BaseController.extend("com.OPA5test.controller.Main", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.getView();
				questionCount = "0";
				thatMain = this;
				questionCount++;
				questionCount = questionCount.toString();
				thatMain = this;
				this._oUiComp = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
				this._oRouter = this._oUiComp.getRouter();
				
				this._oUiComp.inputData =[];	

			thatMain.resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			if(window.location.hash.search("main") == -1){
				// HTML string bound to the formatted text control
					var oModel = new JSONModel({
						HTML : thatMain.resourceBundle.getText("welcomeText")
					});			
				
				thatMain = this;
				this.getView().setModel(oModel, "StartModel");				
	
			}else if(window.location.hash.search("main") > 0){
				if(!thatMain._oUiComp.getModel("userModel")){
					window.location.hash = ""
					window.location.reload();
				}


				var aFilters = [];	
				if(location.origin.search("127.0.0.1") == -1){
					aFilters.push(new sap.ui.model.Filter({path:"questionGroupID", operator: sap.ui.model.FilterOperator.EQ, value1:"%"}))
				}
				aFilters.push(new sap.ui.model.Filter({path:"Responsibility", operator: sap.ui.model.FilterOperator.EQ, value1:"E"}))
				thatMain._oUiComp.getModel("zgw_hcm_exit_doc_srv").read("/questionGroupSet", {
					filters: aFilters,
					success: function (oData) {
						var lengthArray = []
						for(var i=0;i<oData.results.length;i++){
							if(lengthArray.length == 0){
								lengthArray.push(oData.results[i].questionGroupID)
							}else{
								if(oData.results[i].questionGroupID != lengthArray[lengthArray.length -1] ){
									lengthArray.push(oData.results[i].questionGroupID)
								}
							}
						}
						lengthArray.sort(function(a, b){
							return a-b
						})
						questionlength = lengthArray[lengthArray.length -1] 
						questionCount = lengthArray[0]
						questionBegin = questionCount

						if(questionCount >= questionlength){
							thatMain.getView().byId("next").setText(thatMain._oUiComp.getModel("i18n").getResourceBundle().getText("Submit"))
						}
						// Get the Question of questioncount
						aFilters = [];
						aFilters.push(new sap.ui.model.Filter({path:"questionGroupID", operator: sap.ui.model.FilterOperator.EQ, value1:questionCount}))
						aFilters.push(new sap.ui.model.Filter({path:"Responsibility", operator: sap.ui.model.FilterOperator.EQ, value1:responsibility}))
						thatMain._oUiComp.getModel("zgw_hcm_exit_doc_srv").read("/questionGroupSet", {
							filters: aFilters,
							success: function (oData) {
								thatMain.setModels(oData);
							},
							error: function(){	
								thatMain.getView().setBusy(false);
							}
						})
					},
					error: function(){	
						thatMain.getView().setBusy(false);
					}
				})

				// Get the given answers  if there was a reload
				aFilters = [];	
				aFilters.push(new sap.ui.model.Filter({path:"questionHeadID", operator: sap.ui.model.FilterOperator.EQ, value1:thatMain._oUiComp.getModel("userModel").oData.questionHeadID}))
				this._oUiComp.getModel("zgw_hcm_exit_doc_srv").read("/answerSet", {
					filters: aFilters,
					success: function (oData) {
						if(oData.results.length > 0){
							var isSelectedModel = new JSONModel(oData.results);
							thatMain._oUiComp.setModel(isSelectedModel, "isSelectedModel");
							for(var results in oData.results){
								answers.push(oData.results[results]);
							}							
						}
					},
					error: function(){	
						thatMain.getView().setBusy(false);
					}
				})
				
				// Put down worklist table's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the table is
				// taken care of by the table itself.
				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				// keeps the search state
				this._oTableSearchState = [];
				// Model used to manipulate control states
				oViewModel = new JSONModel({
					worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
					tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay: 0
				});
				this.setModel(oViewModel, "worklistView");
				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oTable.attachEventOnce("updateFinished", function() {
					// Restore original busy indicator delay for worklist's table
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			}
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		onLiveChange: function(evt){
			if(evt.getParameters().id.search("username") != -1){
				this._oUiComp.inputData[0] = evt.getParameters().value
				evt.getSource().onsapenter = function(e) { thatMain.begin() }
			}else if(evt.getParameters().id.search("pin") != -1){
				this._oUiComp.inputData[1] = evt.getParameters().value
				evt.getSource().onsapenter = function(e) { thatMain.begin() }
			}
		},
				
		begin: function(event){
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter({path:"nname", operator: sap.ui.model.FilterOperator.EQ, value1:this._oUiComp.inputData[0]}))
			aFilters.push(new sap.ui.model.Filter({path:"pin", operator: sap.ui.model.FilterOperator.EQ, value1:this._oUiComp.inputData[1]}))
			this._oUiComp.getModel("zgw_hcm_exit_doc_srv").read("/questionHeadSet", {
			 	filters: aFilters,
				success: function (oData) {
					if(oData.results.length > 0){
						var userModel = new JSONModel(oData.results[0])
						thatMain._oUiComp.setModel(userModel, "userModel")
						thatMain.getOwnerComponent().getRouter().navTo("main")
					}else{
						sap.m.MessageToast.show("Falsche Anmeldedaten", {
							id: "alertBox",
						})
					}			
			 	},
			 	error: function(){	
			 		thatMain.getView().setBusy(false);
			 	}
			})
		},
		
		

		/* =========================================================== */
		/* Helper Function		                                       */
		/* =========================================================== */

		setModels: function(oData){
			for(var prop in oData.results){
				oData.results[prop].questionGroupID = Number(oData.results[prop].questionGroupID)
				oData.results[prop].questionLevel = Number(oData.results[prop].questionLevel)
				oData.results[prop].questionPosition = Number(oData.results[prop].questionPosition)
			}
			var questionModel = new JSONModel(),
			rowsModel = new JSONModel(),
			questionRows = [],
			question = [];
			for(var prop in oData.results){
				if(oData.results[prop].questionType != ""){
					questionRows.push(oData.results[prop])
				}else{
					question.push(oData.results[prop])
				}
			}
			questionModel.setData(question)
			rowsModel.setData(questionRows)
			thatMain._oUiComp.setModel(rowsModel, "rowsModel")
			this.getView().setModel(rowsModel, "rowsModel")
			thatMain._oUiComp.setModel(questionModel, "questionModel")
			thatMain._oUiComp.setModel(questionModel, "questionModel")
			this.getView().setModel(questionModel, "questionModel")
			if(oData.results.length != 0){
				thatMain.chooseFragment("undone");
			}
			else{
				thatMain.chooseFragment("done");
			}
		},		

		progresscal: function(val){
			if(val){
				var progress = ((questionCount -1) / questionlength) *100;
			}else{
				progress = 100
			}
			return parseInt(progress) 
		},

		setHeadertext: function(val){
			if(val){
				return val.questionGroupID + ". " + val.questionTxt
			}else{
				return this._oUiComp.getModel("i18n").getResourceBundle().getText("thanks")
			}
		},
	});
});