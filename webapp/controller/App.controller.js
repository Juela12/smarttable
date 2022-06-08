
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("smarttable.amarttable1.controller.App", {
            onInit: function () {
                this.userData = {};
                this.userId;
            },

            onReadName: function () {

                var oModel = this.getOwnerComponent().getModel();
                var that = this;

                //Do the call to BE and create the data binding model
                oModel.read(`/ptypeSet`, {
                    success: function (oData) {
                        var sRequest = new sap.ui.model.json.JSONModel(oData.results);
                        that.getView().setModel(sRequest, "Name");

                    },
                    error: function (Error) {
                    }
                });
            },
            onReadSurname: function () {

                var oModel = this.getOwnerComponent().getModel();
                var that = this;

                //Do the call to BE and create the data binding model
                oModel.read(`/ptypeSet`, {
                    success: function (oData) {
                        var sRequest = new sap.ui.model.json.JSONModel(oData.results);
                        that.getView().setModel(sRequest, "Surname");

                    },
                    error: function (Error) {
                    }
                });
            },
            onReadBranch: function () {

                var oModel = this.getOwnerComponent().getModel();
                var that = this;

                //Do the call to BE and create the data binding model
                oModel.read(`/ptypeSet`, {
                    success: function (oData) {
                        var sRequest = new sap.ui.model.json.JSONModel(oData.results);
                        that.getView().setModel(sRequest, "Branch");

                    },
                    error: function (Error) {
                    }
                });
            },


            onSearch: function () {
                var sQuery1 = this.getView().byId("productInput").getValue();
                var sQuery2 = this.getView().byId("productInput1").getValue();
                var sQuery3 = this.getView().byId("productInput2").getValue();
                var oFilter = [];

                oFilter.push(new Filter("Name", FilterOperator.EQ, sQuery1));
                oFilter.push(new Filter("Surname", FilterOperator.EQ, sQuery2));
                oFilter.push(new Filter("Branch", FilterOperator.EQ, sQuery3));
                // var oFilter = new Filter({
                //   filters: [
                //     new Filter("Name", FilterOperator.EQ, sQuery1),
                //     new Filter("Surname", FilterOperator.EQ, sQuery2),
                //     new Filter("Branch", FilterOperator.EQ, sQuery3)

                //   ] });

                // var oFilter = new Filter("Name", FilterOperator.EQ, sQuery1);
                // var oFilter = new Filter("Surname", FilterOperator.EQ, sQuery2);
                // var oFilter = new Filter("Branch", FilterOperator.EQ, sQuery3);

                var oBinding = this.byId("idTable").getBinding("items");
                oBinding.filter(oFilter);

            },



            onValueHelpRequestName: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                var that = this;

                if (!this._pValueHelpDialogName) {
                    this._pValueHelpDialogName = Fragment.load({
                        id: oView.getId(),
                        name: "smarttable.amarttable1.view.fragment.ValueHelpDialogName",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialogName.then(function (oDialog) {
                    that.onReadName();
                    oDialog.open(sInputValue);
                });
            },


            onValueHelpSearchName: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Name", FilterOperator.Contains, sValue);
            },

            onValueHelpCloseName: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    return;
                }

                this.getView().byId("productInput").setValue(oSelectedItem.getTitle());
            },

            onValueHelpRequestSurname: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                var that = this;

                if (!this._pValueHelpDialogSurname) {
                    this._pValueHelpDialogSurname = Fragment.load({
                        id: oView.getId(),
                        name: "smarttable.amarttable1.view.fragment.ValueHelpDialogSurname",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialogSurname.then(function (oDialog) {
                    that.onReadSurname();
                    oDialog.open(sInputValue);
                });
            },


            onValueHelpSearchSurname: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Surname", FilterOperator.Contains, sValue);
            },

            onValueHelpCloseSurname: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    return;
                }

                this.getView().byId("productInput1").setValue(oSelectedItem.getTitle());
            },

            onValueHelpRequestBranch: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                var that = this;

                if (!this._pValueHelpDialogBranch) {
                    this._pValueHelpDialogBranch = Fragment.load({
                        id: oView.getId(),
                        name: "smarttable.amarttable1.view.fragment.ValueHelpDialogBranch",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialogBranch.then(function (oDialog) {
                    that.onReadBranch();
                    oDialog.open(sInputValue);
                });
            },


            onValueHelpSearchBranch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Branch", FilterOperator.Contains, sValue);
            },

            onValueHelpCloseBranch: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    return;
                }

                this.getView().byId("productInput2").setValue(oSelectedItem.getTitle());
            },

            onPress: function (oEvent) {

                var oField = oEvent.getParameter("listItem");
                var oCtx = oField.getBindingContext();
                var oName = oCtx.getProperty("Name");
                 var userId = oCtx.getProperty("UserId");
                this.userData.name = oName;
                this.userData.userId = userId;

                this.getOwnerComponent().getRouter().navTo("Details", {
                    name:oName,
                    id: userId
                });


            },

            onDelete: function (oEvent) {
                    this.userData;
                var oTable = this.getView().byId("Table");
                // var oSelectedItems = oTable.getSelectedItems();
                var oModel = this.getOwnerComponent().getModel();
                // var oName =  oEvent.getParameter("listItem").getSelectedItem().getBindingContext().getProperty("Name");
                // var Name = this.getView().byId("Table").getSelectedItem().getBindingContext("positionsTable2").getObject("Name");
                var oMandt = "800";
                var sPath1 = `/ptypeSet(Mandt='${oMandt}',Name='${this.userData.name}')`;
              
                    oModel.remove(sPath1, {
                        success: function (odata) {
                            MessageBox.success("Deleted successfully!", {
                                
                           
                            });
                           
                        },
                        error: function() {
                            MessageBox.error("Oops! Something wrong to Delete.");
                        }
                            
                    });
                    oModel.refresh(true);  
         
                
            }
        });
    });

