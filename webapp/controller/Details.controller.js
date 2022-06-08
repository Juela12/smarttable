sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/Dialog",
    "../model/formatter"

], function (Controller, History, Dialog, formatter) {
    "use strict";

    return Controller.extend("smarttable.amarttable1.controller.Details", {
        formatter: formatter,

        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Details").attachPatternMatched(this.handleDetails, this);
        },
        handleDetails: function (oEvent) {
          
            this.userId = oEvent.getParameter("arguments").id;
            var oPositions = oEvent.getParameter("arguments").name;
            // var oPositionObject = JSON.parse(oPositions);
            // this.getView().setModel(oPositionModel);
            this.onReadPhoto();
           
        },

        takePhoto: function(){
            var that = this;
            this.fixedDialog = new Dialog({
                title: "Click on the capture to take photo",
                beginButton: new sap.m.Button({
                    text: "Capture Photo",
                press: function(){
                   that.imageVal = document.getElementById("player");
                    that.fixedDialog.close();

                }
                }),
                content:[
                    new sap.ui.core.HTML({
                        content:"<video id = 'player' autoplay></video>"
                    }),

                    new sap.m.Input({
                        placeholder: 'Please enter the image name here',
                        id:"inputId",
                        required: true
                    })
                ],
                endButton: new sap.m.Button ({
                    text: "Cancel",
                    press: function(){
                        that.fixedDialog.close();
                    }

                })
            });

            this.getView().addDependent(this.fixedDialog)

            this.fixedDialog.open();

            this.fixedDialog.attachBeforeClose(this.setImage, this);

            var handleSuccess = function (stream) {
                player.srcObject = stream;
                
            }

            navigator.mediaDevices.getUserMedia({
                video: true
            }).then(handleSuccess)
   
           },
           setImage: function(){
           
            var oVBox = this.getView().byId("wow");
            var items = oVBox.getItems();
            var snapId = 'anubhav-' + items.length;
            var textId = snapId + '-text';
            var imageVal = this.imageVal;
            var idOfInput = sap.ui.getCore().byId('inputId');
            this.getView().setModel(idOfInput.getValue(), 'inputText');



            var oCanvas = new sap.ui.core.HTML({
                content: "<canvas id='" + snapId + "'width = '320px' height = '320px' " +
                 "style = '2px solid red'></canvas>" +
                 "<label id ='"+ textId +"'>" + idOfInput.getValue() + "</label>"
            })
            oVBox.addItem(oCanvas);
            oCanvas.addEventDelegate({
                onAfterRendering: function(){
                    var snapShotCanvas = document.getElementById(snapId);
                    var oContex = snapShotCanvas.getContext('2d');
                    oContex.drawImage(imageVal,0,0, snapShotCanvas.width, snapShotCanvas.height);
                }
            })
           },

           sendToSAP: function(oEvent){
           
            
            var oDataModel = this.getView().getModel();
            var oVBox = this.getView().byId("wow");
            var oItem = oVBox.getItems()[0];

            var snapId = 'anubhav-0';
            

            // var stringImage = document.getElementById(snapId).toDataURL().replace("data:image/jpeg;base64,", "");

            var stringImage = btoa(encodeURI(document.getElementById('anubhav-0').toDataURL().replace("data:image/png;base64,", "")));

            var playload = {
                "UserId":this.userId,
                "Content": stringImage,
                // "Content": btoa(encodeURIComponent(stringImage)),
                "Filename": this.idOfInput,
                "Filetype":"jpeg"
            };

           //Do the call to BE and create the data binding model
           oDataModel.create(`/UserAttachmentSet`,playload, {
            success: function (oData) {
               sap.m.MessageToast.show("Wow! Picture updated to SAP system")
            },
            error: function (Error) {
            }
        });

           },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteApp", true);
            }
        },

        onReadPhoto: function () {

            var oModel = this.getOwnerComponent().getModel();
            var that = this;
            // var oUserId = this.getView().byId("smartTable").getSelectedItem().getBindingContext("").getObject("UserId");
            var sPath1 = `/UserAttachmentSet(UserId='${this.userId}')`;

            //Do the call to BE and create the data binding model
            oModel.read(sPath1, {
                success: function (oData) {
                    var sRequest = new sap.ui.model.json.JSONModel(oData);
                    that.getView().setModel(sRequest, "Photo");

                },
                error: function (Error) {
                }
            });
        },
        
       
    });
});
