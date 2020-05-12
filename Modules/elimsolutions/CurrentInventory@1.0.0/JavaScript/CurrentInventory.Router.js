define('CurrentInventory.Router', ['CurrentInventory.List.View', 'CurrentInventory.ItemDetail.View', 'Profile.Model', 'CurrentInventory.Model', 'CurrentInventory.ItemDetail.Model', 'Backbone', 'Utils'], function (
    CurrentInventoryListView, CurrentInventoryItemDetailView, ProfileModel, CurrentInventoryModel, CurrentInventoryItemDetailModel, Backbone, Utils
) {
    'use strict';

    return Backbone.Router.extend({

        routes: {
            'current-inventory?:options': 'GetFilteredResults',
            'item-details?:options': 'itemDetails' //?options
        }

        ,
        initialize: function (application) {

            this.application = application;
            this.collection = ProfileModel.getInstance().get('currentinventory');
        }

        , createFilteredResults: function (val) {
            // console.log("createFilteredResults");
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
        },
        GetFilteredResults: function (options) {
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

        , itemDetails: function (param) {
            var id = SC.Utils.getParameterByName(location.href, 'id');
            var itemDetailVM = {};
            var itemDetailModel = new CurrentInventoryItemDetailModel();
            var view = new CurrentInventoryItemDetailView({
                application: this.application
                , id: id
            });

            itemDetailModel.fetch({ data: { id: id } }).done(function (data) {
                itemDetailVM = data;
                view.model = new Backbone.Model(itemDetailVM);
                view.showContent();
            });
        }
    });
});