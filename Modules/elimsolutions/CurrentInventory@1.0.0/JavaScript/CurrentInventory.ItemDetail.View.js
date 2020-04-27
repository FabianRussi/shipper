define(
    'CurrentInventory.ItemDetail.View'
    , ['current_inventory_item_detail.tpl'
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
        , 'CurrentInventory.ItemDetail.Model'
    ]
    , function (
        current_inventory_item_detail
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
        , CurrentInventoryItemDetailModel
    ) {
        'use strict';

        return Backbone.View.extend({

            template: current_inventory_item_detail

            , attributes: { 'class': 'CurrentInventoryListView' }

            , title: _('Product Dimensions').translate()

            , page_header: _('Product Dimensions').translate()

            , searchFilterValue: ''

            , filteredResults: []

            , initialize: function (options) {

                var self = this;
                this.options = options;
                this.application = options.application;

                this.options.showCurrentPage = true;

                // this.options.searchFilterValue = options.searchFilterValue;

                /* console.log(this.options);

                this.listenCollection();
                this.setupListHeader();

                var url_options = _.parseUrlOptions(Backbone.history.fragment);

                this.searchFilterValue = url_options.srch;
                this.page = this._getPageFromUrl(url_options.page);
                this.page = this.page - 1;

                console.log('Backbone.history.fragment : ' + Backbone.history.fragment);
                jQuery('.curr-inv-srch').focus();
                BackboneCompositeView.add(this); */

                BackboneCompositeView.add(this);
            }

            , render: function () {
                this.model.attributes.serials = this.groupByDate(this.model.attributes);
                Backbone.View.prototype.render.apply(this, this.model);
            }

            , groupByDate: function (model) {
                var withDates = _.filter(model.serials, function (loc) { return loc.invDetExpirationDate != "" });
                var withDatesGrouped = _.groupBy(withDates, "serial");
                var arr = [];

                for (var key in withDatesGrouped) {
                    arr.push(withDatesGrouped[key][0]);
                    for (var i = 1; i < withDatesGrouped[key].length; i++) {
                        arr[arr.length - 1] = jQuery.extend(arr[i - 1], withDatesGrouped[key][i]);
                    }
                }

                for (var i = 0; i < arr.length; i++) {
                    jQuery.extend(arr[i], model.locations[i]);
                }
                return arr;
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

                console.log(this.options);

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

            // @property {Object} events
            , events: {
                /* 'keyup [data-type="curr-inv-srch"]': 'searchFilter',
                'click [data-type="goSearch"]': 'goSearch' */
            }

            , searchFilter: function (e) {
                /* var value = jQuery("#currInv").val();
                var url = window.location.href;
                var gurl = _.setUrlParameter(url, 'srch', value);
                var gurl2 = _.setUrlParameter(gurl, 'page', '0');
                console.log(gurl2);
                if (e.keyCode == 13 || value === "") {
                    window.location.href = gurl2;
                } */
                //this._render();
            }

            , goSearch: function () {
                var value = jQuery("#currInv").val();
                var url = window.location.href;
                var gurl = _.setUrlParameter(url, 'srch', value);
                var gurl2 = _.setUrlParameter(gurl, 'page', '0');
                console.log(gurl2);
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
                'GlobalViews.Pagination': function () {
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

            , getContext: function () {
                // console.log("Testing ... : " + this.options.options);

                return {
                    Title: 'Product Dimensions'
                    , page_header: this.page_header
                    // , collection: this.collection
                    // , searchFilterValue: this.searchFilterValue
                    // @property {Boolean} collectionLength
                    // , collectionLength: this.options.options.length
                    // @property {Boolean} isLoading
                    , isLoading: this.isLoading
                    // @property {Boolean} showPagination
                    // , showPagination: !!(this.options.options.length && this.collection.models[0].get('recordsPerPage'))
                    // @property {Boolean} showCurrentPage
                    , showCurrentPage: this.options.showCurrentPage
                    , model: this.model
                    //@property {Boolean} showBackToAccount
                    , showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
                };
            }
        });
    });