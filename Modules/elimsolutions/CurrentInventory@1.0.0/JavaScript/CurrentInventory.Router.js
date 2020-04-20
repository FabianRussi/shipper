define('CurrentInventory.Router'
    , ['CurrentInventory.List.View'
        , 'CurrentInventory.ItemDetail.View'
        , 'Profile.Model'
        , 'CurrentInventory.Model'
        , 'CurrentInventory.ItemDetail.Model'
        , 'Backbone'
        , 'Utils'
    ]
    , function (
        CurrentInventoryListView
        , CurrentInventoryItemDetailView
        , ProfileModel
        , CurrentInventoryModel
        , CurrentInventoryItemDetailModel
        , Backbone
        , Utils
    ) {
        'use strict';

        return Backbone.Router.extend({

            routes: {
                'current-inventory?:options': 'GetFilteredResults',
                'item-details/view/:id': 'itemDetails' //?options
            }

            , initialize: function (application) {
                this.application = application;
                this.collection = ProfileModel.getInstance().get('currentinventory');
            }

            , createFilteredResults: function (val) {
                console.log("createFilteredResults");
                var value = val;
                var origonalArr = this.collection.models[0].attributes.records.slice();
                var arrFiltered = [];
                if (!value) {
                    console.log("createFilteredResults 1");
                    return origonalArr;
                }
                if (value) {
                    for (var i = 0; i < origonalArr.length; i++) {
                        var line = origonalArr[i];
                        if (!(line.Name == null || line.Name == undefined || line.Name == "") || !(line.Description == null || line.Description == undefined || line.Description == "")) {
                            if (line.Name.toLowerCase().indexOf(value.toLowerCase()) > -1 || line.Description.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                                arrFiltered.push(line);
                            }
                        } else {
                            console.log("Line NAME at pos " + i + " was empty");
                        }
                    }
                    return arrFiltered;
                }
            }
            , GetFilteredResults: function (options) {
                console.log("made it to ROuter");

                options = (options) ? Utils.parseUrlOptions(options) : { page: 1 };
                console.log("Options Were : " + JSON.stringify(options));
                options.page = options.page || 1;
                options.srch = options.srch || '';

                var filteredResults = this.createFilteredResults(options.srch);

                var view = new CurrentInventoryListView({
                    application: this.application,
                    collection: this.collection,
                    options: filteredResults
                });
                this.collection.on('reset', view.showContent, view);
                view.showContent();
            }

            , itemDetails: function (id) {
                console.log("made it to itemDetails");
                debugger;

                // var params_options = _.parseUrlOptions(options);
                var model = new CurrentInventoryItemDetailModel(); //.getInventoryItem(id)

                var view = new CurrentInventoryItemDetailView({
                    application: this.application
                    , id: id
                    , model: model
                });

                view.showContent();

                // var item = new WebOrderApprovalPendingApprovalCollection();
                /*  var view = new WebOrderApprovalPendingApprovalListView({
                     collection: collection,
                     application: this.application,
                     page: params_options.page,
                     options: params_options
                 });
                 view.showContent();
  */
            }

            //https://customercentersecure.eshipperplus.com/portal/my_account-local.ssp/item-details/view/4108
        });
    });
