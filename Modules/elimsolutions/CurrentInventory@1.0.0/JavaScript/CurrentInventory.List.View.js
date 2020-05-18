define(
    'CurrentInventory.List.View'
    , ['current_inventory_list.tpl'
        , 'Backbone'
        , 'Backbone.CompositeView'
        , 'Backbone.CollectionView'
        , 'RecordViews.View'
        , 'ListHeader.View'
        , 'GlobalViews.Pagination.View'
        , 'GlobalViews.ShowingCurrent.View'
        , 'SC.Configuration'
        , 'jQuery'
        , 'underscore'
    ]
    , function (
        current_inventory_list
        , Backbone
        , BackboneCompositeView
        , BackboneCollectionView
        , RecordViewsView
        , ListHeaderView
        , GlobalViewsPaginationView
        , GlobalViewsShowingCurrentView
        , Configuration
        , jQuery
        , _


    ) {
        'use strict';

        return Backbone.View.extend({

            template: current_inventory_list

            , attributes: { 'class': 'CurrentInventoryListView' }

            , title: _('Current Inventory Status').translate()

            , page_header: _('Current Inventory Status').translate()

            , searchFilterValue: ''

            , filteredResults: []

            , events: {
                'keyup [data-type="curr-inv-srch"]': 'searchFilter',
                'click [data-type="goSearch"]': 'goSearch',
                'change #location': 'filterLocations'
            }

            , initialize: function (options) {

                this.options = options;
                this.application = options.application;
                this.options.showCurrentPage = true;
                this.options.searchFilterValue = options.searchFilterValue;
                this.locations = this.getAllLocations();

                this.listenCollection();
                this.setupListHeader();

                var url_options = _.parseUrlOptions(Backbone.history.fragment);
                this.searchFilterValue = url_options.srch;
                this.page = this._getPageFromUrl(url_options.page);
                this.page = this.page - 1;

                jQuery('.curr-inv-srch').focus();
                BackboneCompositeView.add(this);
            }

            , _getPageFromUrl: function (url_value) {
                var page_number = parseInt(url_value, 10);
                return !isNaN(page_number) && page_number > 0 ? page_number : 1;
            }
            , listenCollection: function () {
                this.setLoading(true);

                this.collection.on({
                    request: _.bind(this.setLoading, this, true)
                    , reset: _.bind(this.setLoading, this, false)
                });

                this.setLoading(false);
            }

            , setupListHeader: function () {
                // manges sorting and filtering of the collection
                this.listHeader = new ListHeaderView({
                    view: this
                    , application: this.application
                    , collection: this.collection
                    // ,	filters: this.filterOptions
                    , sorts: this.sortOptions
                    , allowEmptyBoundaries: true
                });
            }

            , setLoading: function (is_loading) {
                //@property {Boolean} isLoading
                this.isLoading = is_loading;
            }

            , searchFilter: function (e) {
                var value = jQuery("#currInv").val();
                var url = window.location.href;
                var gurl = _.setUrlParameter(url, 'srch', value);
                var gurl2 = _.setUrlParameter(gurl, 'page', '0');
                // console.log(gurl2);
                if (e.keyCode == 13 || value === "") {
                    window.location.href = gurl2;
                }
            }

            , goSearch: function () {
                var value = jQuery("#currInv").val();
                var url = window.location.href;
                var gurl = _.setUrlParameter(url, 'srch', value);
                var gurl2 = _.setUrlParameter(gurl, 'page', '0');
                // console.log(gurl2);
                window.location.href = gurl2;
            }

            , chunkArray: function (myArray, chunk_size) {
                var index = 0;
                var arrayLength = myArray.length;
                var tempArray = [];
                for (index = 0; index < arrayLength; index += chunk_size) {
                    var myChunk = myArray.slice(index, index + chunk_size);
                    // Do something if you want with the group
                    tempArray.push(myChunk);
                }
                return tempArray;
            }

            , childViews: {
                'CurrentInventory.List.Items': function () {
                    var recs = this.options.options;
                    var arr = this.chunkArray(recs, this.collection.models[0].get('recordsPerPage'));
                    recs = arr[this.page];
                    var records_collection = new Backbone.Collection(recs.map(function (currentinventorymodel) {
                        return new Backbone.Model({
                            title: currentinventorymodel['Name'],

                            internalid: currentinventorymodel.id
                            , showInModal: false
                            , generateRemoveButton: false
                            , columns: [
                                {
                                    label: 'Description'
                                    , type: 'description'
                                    , name: 'description'
                                    , value: currentinventorymodel['Description']
                                }
                                , {
                                    label: 'Available Quantity'
                                    , type: 'Available Quantity'
                                    , name: 'Available Quantity'
                                    , value: currentinventorymodel['Available']
                                }

                                , {
                                    label: 'On Hand Quantity'
                                    , type: 'On Hand Quantity'
                                    , name: 'On Hand Quantity'
                                    , value: currentinventorymodel['Committed']
                                }

                                , {
                                    label: 'Committed Quantity'
                                    , type: 'Committed Quantity'
                                    , name: 'Committed Quantity'
                                    , value: currentinventorymodel['On Hand']
                                }
                            ]
                        });
                    }));

                    return new BackboneCollectionView({
                        childView: RecordViewsView
                        , collection: records_collection
                        , viewsPerRow: 1
                    });
                }
                , 'GlobalViews.Pagination': function () {
                    return new GlobalViewsPaginationView(_.extend({
                        totalPages: Math.ceil(this.options.options.length / this.collection.models[0].get('recordsPerPage'))
                    }, Configuration.defaultPaginationSettings));
                }
                , 'GlobalViews.ShowCurrentPage': function () {
                    return new GlobalViewsShowingCurrentView({
                        items_per_page: this.collection.models[0].get('recordsPerPage')
                        , total_items: this.options.options.length
                        , total_pages: Math.ceil(this.options.options.length / this.collection.models[0].get('recordsPerPage'))
                    });
                }
                , 'List.Header': function () {
                    return this.listHeader;
                }
            }
            , getSelectedMenu: function () {
                return 'currentinventory';
            }

            , getBreadcrumbPages: function () {
                return {
                    text: 'Current Inventory'
                };
            }

            , getAllLocations: function () {
                var locations = [];
                for (var i = 0; i < this.options.collection.models.length; i++) {
                    for (var o = 0; o < this.options.collection.models[i].attributes.locations.length; o++) {
                        if (!this.locationIsInRecords(this.options.collection.models[i].attributes.records, this.options.collection.models[i].attributes.locations[o].name)) {
                            locations.push(this.options.collection.models[i].attributes.locations[o]);
                        }
                    }
                }
                return locations;
            }

            , filterLocations: function () {
                debugger;
                var locations = [];
                for (var i = 0; i < this.options.collection.models.length; i++) {
                    for (var o = 0; o < this.options.collection.models[i].attributes.records.length; o++) {
                        locations.push(this.options.collection.models[i].attributes.records[o]);
                    }
                }
                var selectedOptionName = jQuery('#location option:selected').text();
                var selectedOption = jQuery('#location option:selected').val();
                var selected = null;

                if (selectedOption != "allLocations") {
                    selected = _.filter(locations, function (item) {
                        return item.Location.id == selectedOption;
                    });
                } else {
                    selected = locations;
                }

                // if (selectedOption != "allLocations") {
                selected = _.unique(selected, 'Name');
                // }

                $('#curInv').empty();

                for (var i = 0; i < selected.length; i++) {
                    var ret = [];
                    var currentAvailable = '';
                    var currentonHand = '';
                    var quantityCommited = '';

                    if (selectedOption != "allLocations") {
                        ret = selected[i].locationsDetails.filter(function (item) {
                            return item.locationName === jQuery('#location option:selected').text();
                        });
                        currentAvailable = ret[0].quantityAvailable;
                        currentonHand = ret[0].quantityOnHand;
                        quantityCommited = ret[0].quantityCommited;
                    }
                    else {
                        currentonHand = selected[i]['On Hand'];
                        currentAvailable = selected[i].Available;
                        currentAvailable = selected[i].quantityCommited;
                    }

                    $('#curInv').append('<tr class="recordviews-row" data-item-id="" data-navigation-hashtag="" data-action="navigate">' +
                        '<td class="recordviews-title" data-name="title"><span class="recordviews-title-value">' +
                        '<a class="recordviews-title-anchor" href="#/item-details?id=' + selected[i].id + '" data-touchpoint="customercenter" data-id="' + selected[i].id + '">' + selected[i].Name + '</a></span></td> ' +
                        '<td class="recordviews-description" data-name="description"> <span class="">' + selected[i].Description + '</span>' +
                        '<span class="recordviews-value"></span></td><td class="recordviews-Available Quantity" data-name="Available Quantity">' +
                        '<span class="recordviews-label">Available Quantity</span> <span class="recordviews-value">' + currentAvailable + '</span></td><td class="recordviews-On Hand Quantity" data-name="On Hand Quantity"> ' +
                        '<span class="recordviews-label">On Hand Quantity</span> <span class="recordviews-value">' + quantityCommited + '</span>  </td>  <td class="recordviews-Committed Quantity" data-name="Committed Quantity"> ' +
                        '<span class="recordviews-label">Committed Quantity</span> <span class="recordviews-value">' + currentonHand + '</span> </td> </tr>');
                }

                var selectedQty = selected.length;
                if (selectedQty == 0 || selectedQty < 20) {
                    $('.current-inventory-list-case-list-paginator').css('display', 'none');
                }
                else {
                    $('.current-inventory-list-case-list-paginator').css('display', 'block');
                }
            }

            , locationIsInRecords: function (records, name) {
                for (var i = 0; i < records.length; i++) {
                    if (records[i].Location.name == name) {
                        return false;
                    }
                }
                return true;
            }

            , getContext: function () {
                return {
                    Title: 'Current Inventory Status'
                    , page_header: this.page_header
                    , collection: this.collection
                    , searchFilterValue: this.searchFilterValue
                    // @property {Boolean} collectionLength
                    , collectionLength: this.options.options.length
                    // @property {Boolean} isLoading
                    , isLoading: this.isLoading
                    // @property {Boolean} showPagination
                    , showPagination: !!(this.options.options.length && this.collection.models[0].get('recordsPerPage'))
                    // @property {Boolean} showCurrentPage
                    , showCurrentPage: this.options.showCurrentPage
                    //@property {Boolean} showBackToAccount
                    , showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
                    , locations: this.locations
                };
            }
        });
    });