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

  var sViewName = "Main",
    sSomethingThatCannotBeFound = "*#-Q@@||"

  Opa5.createPageObjects({
    onTheMainPage: {
      baseClass: Common,

      actions: {
        iPressTheDialogButton:function(buttontext){
          return this.waitFor({
            viewName: sViewName,
            searchOpenDialogs : true,
            controlType: "sap.m.Button",
            actions: function (oElement) {
              if(oElement.getProperty("text") == buttontext) {
                oElement.$().trigger("tap")
              }  
            },
          })
        }
      },
      assertions: {
        iShouldSeeTheProgressIndicator: function(){
          return this.waitFor({
            controlType: "sap.m.ProgressIndicator",
            viewName: sViewName,
            success: function (oElement) {
              Opa5.assert.ok(oElement,"Found the Progress Indicator")
            },
            errorMessage: "Can't see the Progress Indicator."
          }) 
        },

        iShouldSeetheHeadDataTable: function(){
          return this.waitFor({
            controlType: "sap.m.List",
            viewName: sViewName,
            success: function (oElement) {
              Opa5.assert.ok(oElement,"Found the Head Data Table")
            },
            errorMessage: "Can't see the Head Data Table."
          }) 
        },

        iShouldSeeTheQuestions: function(){
          var finish;
          return this.waitFor({
            id: "flexContent1",
            viewName: sViewName,
            matchers: function(oElement){
              if(oElement.oPropagatedProperties.oModels.questionModel){
                if(oElement.oPropagatedProperties.oModels.questionModel.oData.length > 0){
                  if(oElement.oPropagatedProperties.oModels.questionModel.oData[0].questionTxt == oElement.getContent()[0].getText().substr(oElement.getContent()[0].getText().indexOf(".")+2)){
                    finish=false;
                    return true;
                  }
                }else if(oElement.getContent()[0].getText() == "Danke für die Teilnahme"){
                  finish= true;
                  return true;
                }
              }
            },
            success: function (oElement) {
              if(finish){
                Opa5.assert.ok(oElement,"Found Finish Text")
              }else{
                Opa5.assert.ok(oElement,"Found the Question")
              }
            },
            errorMessage: "Can't see the Question."
          }) 
        },
        
        iShouldSeeTheAnswers: function(iObjIndex){
          return this.waitFor({
            controlType: "sap.m.Table",
            viewName: sViewName,
            success: function (oList) {
              Opa5.assert.strictEqual(oList[0].getItems().length, iObjIndex, "The list has " + iObjIndex +  " items");
            },
            errorMessage: "List does not have " + iObjIndex + " entries."
          });
        },

        theRightAnswersAreSet: function(markedList){
          return this.waitFor({
            controlType: "sap.m.ColumnListItem",
            viewName: sViewName,
            matchers: function(oElement){ 
              if(oElement.getCells()[2].getProperty("groupName") == markedList[0]){
                if(oElement.getCells()[markedList[1]].getProperty("selected")){
                  return true
                }else {
                  return false
                }
              }
            },
            success: function (oList) {
              Opa5.assert.ok(oList,  "The marks on " + oList[0].getCells()[2].getProperty('groupName') + " are set correctly");
            },
            errorMessage: "The mark on " + markedList[0] + " are set false."
          });
        },
        theProgressIndicatorHasChanged: function(oldValue){
          return this.waitFor({
            controlType: "sap.m.ProgressIndicator",
            viewName: sViewName,
            success: function (oElement) {
              Opa5.assert.notStrictEqual(oElement[0].getProperty("percentValue"), oldValue,"Progress Indicator has changed from " + oldValue + "% to " + oElement[0].getProperty("percentValue") + "%")
            },
            errorMessage: "Progress Indicator hasn't changed."
          }) 
        },

        iShouldSeeCheckboxQuestion:function(questionText){
          return this.waitFor({
            controlType:"sap.m.CustomListItem",
            viewName: sViewName,
            matchers: function(oElement){
              if("text" in oElement.getContent()[0].mProperties){
                if(oElement.getContent()[0].getProperty("text") == questionText){
                  return oElement
                } 
              }   
            },
            success: function (oElement) {
              Opa5.assert.ok(oElement,"Checkboxquestion is displayed correctly")
            },
            errorMessage: "Checkboxquestion is not displayed correctly."
          })
        },

        iShouldSeeCheckboxItems:function(itemscount){
          return this.waitFor({
            controlType: "sap.m.List",
            viewName: sViewName,
            matchers: new AggregationLengthEquals({name : "items", length: itemscount}),  
            success: function (oList) {
              Opa5.assert.strictEqual(oList[0].getItems().length, itemscount, "The list has " + itemscount +  " items");
            },
            errorMessage: "There is no List with " + itemscount + " entries."
          });
        },

        theRightCheckboxesShouldBeMarked:function(answerText){
          this.waitFor({
            controlType:"sap.m.Label",
            viewName: sViewName,
            matchers: new sap.ui.test.matchers.PropertyStrictEquals({
              name: "text",
              value: answerText}),
            success: function(oLabel){  
              Opa5.assert.strictEqual(oLabel[0].getParent().getItems()[0].getSelected(), true, "The Label with the Answertext " + answerText + " was marked correctly")
            },
            errorMessage: "checkboxlabel."
          })
        },

        iShouldSeeTheYesNoMaybeItem:function(QuestionNr, markedText){
          var CustomListItem,
              selectedBox
          this.waitFor({
            controlType:"sap.m.CustomListItem",
            viewName: sViewName,
            matchers:
              function(CustomListItems){
                if(CustomListItems.sId.search("yes_no_maybefragment") != -1){
                  return CustomListItems
                }
              },
            success: function (CustomListItems) {
              CustomListItem = CustomListItems 
              return this.waitFor({
                controlType:"sap.m.Label",
                viewName: sViewName,
                check: function(oLabelList){
                  for(var ListItems in CustomListItem){
                    for(var labels in oLabelList){
                      if("groupName" in oLabelList[labels].getParent().mProperties){
                        var groupName = oLabelList[labels].getParent().getText()
                        if(CustomListItem[ListItems] == oLabelList[labels].getParent().getParent().getParent().getParent() && oLabelList[labels].getParent().getProperty("groupName").search(QuestionNr) != -1){
                          for(var i = labels; i <= oLabelList.length; i++){
                            if(oLabelList[i].getParent().sId.search("button") != -1){
                              var text = oLabelList[i].getParent().getText()
                              if(text == markedText){
                                if(oLabelList[i].getParent().getProperty("selected")){
                                  selectedBox = oLabelList[i]
                                  return oLabelList[i].getParent().getProperty("selected")
                                }  
                              }
                            }
                          }
                        }
                      }
                    }
                  }     
                },  
                success: function (oLabel) {
                  Opa5.assert.ok(oLabel, "On Question " + QuestionNr + " is " + selectedBox.getParent().getParent().getItems()[0].getText() + " selected");
                },
                errorMessage: QuestionNr + "no yes_no_maybefragment."
              })        
            },
            errorMessage: "There is no yes_no_maybefragment "
          });
        },

        iShouldSeeThePlusMinusItem:function(QuestionNr, markedText){
          var CustomListItem,
              selectedBox
          this.waitFor({
            controlType:"sap.m.CustomListItem",
            viewName: sViewName,
            matchers:
              function(CustomListItems){
                if(CustomListItems.sId.search("plus_minusfragment") != -1){
                  return CustomListItems
                }
              },
            success: function (CustomListItems) {
              CustomListItem = CustomListItems 
              return this.waitFor({
                controlType:"sap.m.Label",
                viewName: sViewName,
                check: function(oLabelList){
                  for(var ListItems in CustomListItem){
                    for(var labels in oLabelList){
                      if("groupName" in oLabelList[labels].getParent().mProperties){
                        var groupName = oLabelList[labels].getParent().getText()
                        if(CustomListItem[ListItems] == oLabelList[labels].getParent().getParent().getParent().getParent().getParent() && oLabelList[labels].getParent().getProperty("groupName").search(QuestionNr) != -1){
                          for(var i = labels; i <= oLabelList.length; i++){
                            if(oLabelList[i].getParent().sId.search("button") != -1){
                              var text = oLabelList[i].getParent().getText()
                              if(text == markedText){
                                if(oLabelList[i].getParent().getProperty("selected")){
                                  selectedBox = oLabelList[i]
                                  return oLabelList[i].getParent().getProperty("selected")
                                }  
                              }
                            }
                          }
                        }
                      }
                    }
                  }     
                },  
                success: function (oLabel) {
                  Opa5.assert.ok(oLabel, "On Question " + QuestionNr + " is " + selectedBox.getText() + " selected");
                },
                errorMessage: "no Plus Minus fragment for QuestionNr. " + QuestionNr + " visible or the marks are set false"
              })        
            },
            errorMessage: "There is no Plus Minus Fragment "
          });
        },

        iShouldSeeTheTextboxItems:function(QuestionNr, Answer){
          var type;
          if(QuestionNr > 1){
            type = "additional field"
          }else{
            type = "Textfield"
          }
          return this.waitFor({
            controlType:"sap.m.Panel",
            viewName: sViewName,
            matchers:[
                new sap.ui.test.matchers.PropertyStrictEquals({
                  name: "headerText",
                  value: "expand for free text"}), 
                new AggregationContainsPropertyEqual({
                  aggregationName:"content",
                  propertyName: "value",
                  propertyValue: Answer
                })
            ],
            success: function (oPanel) {
              Opa5.assert.ok(oPanel, "Found the " + type + " " + QuestionNr + " with the Answer " + Answer);
            },
            errorMessage: "No " + type + " implemented for QuestionNr. " + QuestionNr
          })
        },
        iScouldSeeTheDialog:function(){
          return this.waitFor({
            timeout:30,
            pollingInterval:100,
            searchOpenDialogs: true,
            controlType:"sap.m.Dialog",
            viewName: sViewName,
            
            success: function (oDialog) {
              Opa5.assert.ok(oDialog, "Found the Dialog ");
            },
            errorMessage: "Can't find the dialog"
          })
        }
      }
    }
  })
})