define('CurrentInventory.Router'
    ,   [   'CurrentInventory.List.View'
        ,   'Profile.Model'
        ,   'CurrentInventory.Model'
        ,   'Backbone'
        ,   'Utils'
    ]
    ,   function (
        CurrentInventoryListView
        ,   ProfileModel
        ,   CurrentInventoryModel
        ,   Backbone
        ,   Utils
    )
    {
        'use strict';

        return Backbone.Router.extend({

            routes: {
                'current-inventory?:options' : 'GetFilteredResults'
            }

            ,   initialize: function (application)
            {
                this.application = application;
                this.collection = ProfileModel.getInstance().get('currentinventory');
            }






            , createFilteredResults: function(val)
            {
                console.log("createFilteredResults");
                var value = val;
                var origonalArr = this.collection.models[0].attributes.records.slice();
                var arrFiltered = [];
                if(!value){
                    console.log("createFilteredResults 1");
                    return origonalArr;
                }
                if(value){
                    for (var i = 0; i < origonalArr.length; i++){
                        var line = origonalArr[i];
                        if(!(line.Name == null || line.Name == undefined || line.Name == "") || !(line.Description == null || line.Description ==undefined || line.Description == "")){
                            if( line.Name.toLowerCase().indexOf(value.toLowerCase()) > -1 || line.Description.toLowerCase().indexOf(value.toLowerCase()) > -1 ){
                                arrFiltered.push(line);
                            }
                        }else{
                            console.log("Line NAME at pos " + i + " was empty");
                        }
                    }
                    return arrFiltered;
                }
            }
            ,	GetFilteredResults: function (options)
            {
                console.log("made it to ROuter");

                options = (options) ? Utils.parseUrlOptions(options) : {page: 1};
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
                // var params_options = _.parseUrlOptions(options);
                var model = {}; //new CurrentInventoryItemDetailModel();
                model.internalId = 19213;
                model.name = 'BE 10150';
                model.description = 'Item description';
                model.type = 'Item type';
                model.basePrice = 300;
                model.height = 30;
                model.weight = 4.5;
                model.location = 'Item location';
                model.reorderPoint = 'Item reorder point';
                model.serial = 'Item serial';
                model.onHand = 'Item on hand';
                model.available = 'Item available';
                model.stockUnit = 'Item stockUnit';
                model.binNumber = 'Item binNumber';
                model.status = 'Item status';
                model.quantity = 'Item quantity';
                model.expirationDate = 'Item expirationDate';
                model.locationDetails = 'Item locationDetails';
                model.locationCommited = 'Item locationCommited';

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
