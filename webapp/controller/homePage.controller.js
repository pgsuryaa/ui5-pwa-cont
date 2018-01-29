sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"zpwa_test/util/CustomMessageRight",
	"zpwa_test/util/CustomMessageLeft"
], function(Controller, UserResponse, BotResponse) {
	"use strict";

	return Controller.extend("zpwa_test.controller.homePage", {
		onInit: function() {
			var that = this;

			this.client = new ApiAi.ApiAiClient({
				accessToken: '8c2701f82f2d410dabdcd2b3106ed276'
			});
			var count = 0;
			var commandHello = {
				smart: true,
				indexes: ["*"], // These spoken words will trigger the execution of the command
				action: function(i, wildcard) { // Action to be executed when a index match with spoken word

					var oMessage = new UserResponse();
					oMessage.addContent(new sap.m.Text({
						text: wildcard
					}));
					that.getView().byId("msgContent").addContent(oMessage);
					jQuery.sap.delayedCall(500, that, function() {
						that.scrollDown();
					});
					that.sendText(wildcard).then(function(response) {
						var result = response.result.fulfillment.speech;
						oMessage = new BotResponse();
						if (response.result.metadata.intentName === "createNote") {
							that.actNo = response.result.parameters.actNo;
							that.custName = response.result.parameters.custName;
							that.note = response.result.parameters.note;
							that.recallDate = response.result.parameters.recallDate;
							if (that.actNo)
								that.actNo = that.prependZeroes(that.actNo);
							if (that.actNo && !that.recallDate && !that.note) {
								var flag = 0;
								var oModel = that.getView().getModel("actModel");
								for (var i = 0; i < oModel.oData.d.results.length; i++) {
									if (oModel.oData.d.results[i].AccountId == that.actNo) {
										flag = 1;
										response.result.parameters.custName = oModel.oData.d.results[i].SoldToPartner;
										that.custName = oModel.oData.d.results[i].SoldToPartner;
										result = "So it is for " + that.custName + ". What's the recall date?";
									}
								}
								if (!flag) {
									result = "I couldn't find the account. Please tell correct account number.";
								}
							}
							if (that.actNo && that.note) {

								var oModel = that.getView().getModel("actModel");
								for (var i = 0; i < oModel.oData.d.results.length; i++) {

									if (oModel.oData.d.results[i].AccountId == that.actNo) {
										var oItem = JSON.parse(JSON.stringify(oModel.oData.d.results[i]));

										jQuery.sap.require("sap.ui.core.format.DateFormat");
										var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
											pattern: "dd/MM/yyyy"
										});
										var oNote = "Last note : " + oDateFormat.format(new Date()) + " : " + that.note;
										oItem.ActivityId = that.generateActivityId(oModel.oData.d.results);
										oItem.StartDate = "/Date(" + new Date().getTime() + ")/";
										oItem.EndDate = "/Date(" + new Date(that.recallDate).getTime() + ")/";
										oItem.Notes = oNote;
										oModel.oData.d.results.push(oItem);
										oModel.refresh();
										result = "Great! Activity-" + oItem.ActivityId + "  is created with notes.";
										that.simulateInput("more");
										break;
									}

									// if (oModel.oData.d.results[i].ActivityId == that.actId) {
									// jQuery.sap.require("sap.ui.core.format.DateFormat");
									// var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
									// 	pattern: "dd/MM/yyyy"
									// });
									// var oNote = "Last note : " + oDateFormat.format(new Date()) + " : " + that.note;
									// oModel.oData.d.results[i].Notes = oNote;
									// 	oModel.refresh();
									// }
								}

							}
						} else if (response.result.metadata.intentName === "showActivities") {
							that.custName = response.result.parameters.custName;

							if (that.custName) {
								var oModel = that.getView().getModel("actModel");
								var oItems = [];
								for (var i = 0; i < oModel.oData.d.results.length; i++) {
									var str = oModel.oData.d.results[i].SoldToPartner.toLowerCase();
									if (str == that.custName.toLowerCase()) {

										oItems.push(oModel.oData.d.results[i]);
									}
								}
								if (oItems.length) {
									var oData = {
										"d": {
											"results": oItems
										}
									};
									var id = "tempModel" + count;
									var tempModel = new sap.ui.model.json.JSONModel(oData);
									that.getView().setModel(tempModel, id);
									var oList = new sap.m.List();
									oList.bindItems({
										path: id + ">/d/results",
										template: new sap.m.ObjectListItem({
											title: "{" + id + ">SoldToPartner}",
											number: "{" + id + ">AccountId}",
											attributes: [new sap.m.ObjectAttribute({
												text: "{" + id + ">Notes}"
											})]
										})
									});
									oMessage.addContent(oList);
									count++;

								}
							} else {
								var id = "tempModel" + count;
								var oData = that.getView().getModel("actModel").getData();
								var tempModel = new sap.ui.model.json.JSONModel(oData);
								that.getView().setModel(tempModel, id);
								var oList = new sap.m.List();
								oList.bindItems({
									path: id + ">/d/results",
									template: new sap.m.ObjectListItem({
										title: "{" + id + ">SoldToPartner}",
										number: "{" + id + ">AccountId}",
										attributes: [new sap.m.ObjectAttribute({
											text: "{" + id + ">Notes}"
										})]
									})
								});
								oMessage.addContent(oList);
								count++;
							}

						} else if (response.result.metadata.intentName === "chooseAct") {

						} else if (response.result.metadata.intentName === "createNote - more") {
							if (response.result.parameters.confirm === "yes")
								result = "Oh Yes! Added to Calendar";
							else if (response.result.parameters.confirm === "no") {
								result = "Okay. Didn't add ";
							}

						}
						oMessage.addContent(new sap.m.Text({
							text: result
						}));
						artyom.say(result);
						that.getView().byId("msgContent").addContent(oMessage);
						jQuery.sap.delayedCall(500, that, function() {
							that.scrollDown();
						});
					});
				}
			};

			artyom.addCommands(commandHello);
		},
		onAfterRendering: function() {
			var that = this;
			this.app = sap.ui.getCore().byId("appId");
			if(!this.rendered){
			this.simulateInput("Hey. I am "+this.app.username);
			this.rendered=true;
			}
			this.getView().byId('unameBtn').setText(this.app.username);
			// this.sendText("Hey!").then(function(response){
			// 	var oMessage= new BotResponse();
			// 	oMessage.addContent(new sap.m.Text({
			// 		text: response.result.fulfillment.speech
			// 	}));
			// 	that.getView().byId("msgContent").addContent(oMessage);
			// 	artyom.say(response.result.fulfillment.speech);
			// });
			//	dragElement(document.getElementById('homeView--mydiv'));
		},
		toggleListen: function(oEvent) {
			if (artyom.isRecognizing()) {
				artyom.fatality();
				$('#homeView--micBtn').css("animation", "none");
			} else {
				artyom.initialize({
					lang: "en-GB", // A lot of languages are supported. Read the docs !
					continuous: false, // recognize 1 command and stop listening !
					listen: true, // Start recognizing
					debug: true, // Show everything in the console
					speed: 1 // talk normally
				}).then(function() {
					console.log("Ready to work !");
				});
				$('#homeView--micBtn').css("animation", "pulse 1s infinite");
			}
			//artyom.simulateInstruction("Hello")
		},
		showActivities: function() {
			this.app = sap.ui.getCore().byId("appId");
			var oModel = this.getView().getModel('actModel');
			oModel.oData.d.results.sort(this.compare);
			oModel.refresh();
			this.app.to("actView");
		},
		handleRefresh: function(evt) {
			setTimeout(function() {
				this.getView().byId("pullToRefresh").hide();
				//window.location = window.location;
				this.getView().byId('msgContent').removeAllContent();

			}.bind(this), 500);
		},
		sendText: function(text) {
			return this.client.textRequest(text);
		},
		scrollDown: function() {
			//document.getElementById("popoverIdApv-scroll").scrollTop = document.getElementById("popoverIdApv-scroll").scrollHeight;
			var itemContent = this.getView().byId('msgContent').getContent();
			var lastLength = itemContent.length;
			var lastContent = itemContent[lastLength - 1];
			var lastContentId = lastContent.getId();
			sap.ui.getCore().byId(lastContentId).getDomRef().scrollIntoView();
			//	 sap.ui.getCore().byId("msgData").focus();
		},
		date: function(value) {
			if (value) {

				var dateStr = value.toString();
				var dateint = parseInt(dateStr.substring(6));
				jQuery.sap.require("sap.ui.core.format.DateFormat");
				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "MM/dd/yyyy"
				});
				return oDateFormat.format(new Date(dateint));
			} else {
				return value;
			}
		},
		generateActivityId: function(oArray) {
			var id = parseInt(oArray[0].ActivityId);
			for (var i = 0; i < oArray.length; i++) {
				if (id < parseInt(oArray[i].ActivityId)) {
					id = parseInt(oArray[i].ActivityId);
				}

			}
			id++;
			id = id.toString();
			id = this.prependZeroes(id);
			return id;

		},
		prependZeroes: function(id) {
			for (var i = id.length; i < 10; i++) {
				id = "0" + id;
			}
			return id;
		},
		simulateInput: function(text) {
			//artyom.simulateInstruction(text);
			var that = this;
			this.sendText(text).then(function(response) {
				var oMessage = new BotResponse();
				oMessage.addContent(new sap.m.Text({
					text: response.result.fulfillment.speech
				}));
				that.getView().byId("msgContent").addContent(oMessage);
				artyom.say(response.result.fulfillment.speech);
				jQuery.sap.delayedCall(500, that, function() {
					that.scrollDown();
				});
				return response;
			});
		},
		typeInput: function(oEvent) {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("zpwa_test.view.messageBox", this);
				this.getView().addDependent(this._oPopover);
			}
			if (!this._oPopover.isOpen()) {

				var oButton = oEvent.getSource();
				jQuery.sap.delayedCall(0, this, function() {
					this._oPopover.openBy(oButton);
					this._oPopover.setVisible(true);
				});
			} else {
				this._oPopover.close();
			}

		},
		onMsgSend: function() {
			var msg = sap.ui.getCore().byId('messageIpt').getValue();
			if (msg != "") {
				artyom.simulateInstruction(msg);
				sap.ui.getCore().byId('messageIpt').setValue("");
			}

		},
		compare: function(a, b) {
			return b.ActivityId - a.ActivityId;
			// var x = parseInt(a.StartDate.replace("/Date(", "").replace(")/", ""));
			// var y = parseInt(b.StartDate.replace("/Date(", "").replace(")/", ""));
			// if (x < y)
			// 	return -1;
			// if (x > y)
			// 	return 1;
			// return 0;
		},
		onLogout:function(){
			// this.app.username="";
			// this.app.password="";
			// this.app.back();
			// this.getView().byId('msgContent').destroyContent();
			window.location.href=window.location.href;
		}

	});
});