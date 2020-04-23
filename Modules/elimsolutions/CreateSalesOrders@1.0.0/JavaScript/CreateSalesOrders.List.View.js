define(
    'CreateSalesOrders.List.View', ['create_sales_order_list.tpl', 'Backbone', 'Backbone.CompositeView', 'Backbone.CollectionView', 'RecordViews.View', 'ListHeader.View', 'GlobalViews.Pagination.View', 'GlobalViews.ShowingCurrent.View', 'SC.Configuration', 'jQuery', 'underscore'],
    function(
        create_sales_order_list, Backbone, BackboneCompositeView, BackboneCollectionView, RecordViewsView, ListHeaderView, GlobalViewsPaginationView, GlobalViewsShowingCurrentView, Configuration, jQuery, _


    ) {
        'use strict';

        return Backbone.View.extend({

            template: create_sales_order_list

            ,
            attributes: { 'class': 'CreateSalesOrdersListView' }

            ,
            title: _('Place A New Sales Order').translate()

            ,
            page_header: _('Create sale order').translate()

            ,
            searchFilterValue: ''

            ,
            filteredResults: []


            ,
            initialize: function(options) {
                
                this.options = options;
                this.application = options.application;

                this.options.showCurrentPage = true;
                this.options.searchFilterValue = options.searchFilterValue;

                console.log(this.options);


                this.listenCollection();
                this.setupListHeader();

                var url_options = _.parseUrlOptions(Backbone.history.fragment);

                console.log(url_options);

                this.searchFilterValue = url_options.srch;
                this.page = this._getPageFromUrl(url_options.page);
                this.page = this.page - 1;

                console.log('Backbone.history.fragment : ' + Backbone.history.fragment);
                jQuery('.curr-inv-srch').focus();
                BackboneCompositeView.add(this);

            }


            ,
            _getPageFromUrl: function(url_value) {
                var page_number = parseInt(url_value, 10);
                return !isNaN(page_number) && page_number > 0 ? page_number : 1;
            },
            listenCollection: function() {
                this.setLoading(true);

                this.collection.on({
                    request: _.bind(this.setLoading, this, true),
                    reset: _.bind(this.setLoading, this, false)
                });

                console.log(this.options);

                this.setLoading(false);
            }


            ,
            setupListHeader: function() {
                // manges sorting and filtering of the collection
                this.listHeader = new ListHeaderView({
                    view: this,
                    application: this.application,
                    collection: this.collection
                        // ,	filters: this.filterOptions
                        ,
                    sorts: this.sortOptions,
                    allowEmptyBoundaries: true
                });
            }

            ,
            setLoading: function(is_loading) {
                //@property {Boolean} isLoading
                this.isLoading = is_loading;
            }

            // @property {Object} events
            ,
            events: {
                'keyup [data-type="curr-inv-srch"]': 'searchFilter',
                'click [data-type="goSearch"]': 'goSearch'
            }


            ,
            searchFilter: function(e) {

                var value = jQuery("#currInv").val();
                var url = window.location.href;
                var gurl = _.setUrlParameter(url, 'srch', value);
                var gurl2 = _.setUrlParameter(gurl, 'page', '0');
                console.log(gurl2);
                if (e.keyCode == 13 || value === "") {
                    window.location.href = gurl2;
                }
                //this._render();
            }

            ,
            goSearch: function() {

                var value = jQuery("#currInv").val();
                var url = window.location.href;
                var gurl = _.setUrlParameter(url, 'srch', value);
                var gurl2 = _.setUrlParameter(gurl, 'page', '0');
                console.log(gurl2);
                window.location.href = gurl2;
            }

            ,
            chunkArray: function(myArray, chunk_size) {
                var index = 0;
                var arrayLength = myArray.length;
                var tempArray = [];
                for (index = 0; index < arrayLength; index += chunk_size) {
                    var myChunk = myArray.slice(index, index + chunk_size);
                    // Do something if you want with the group
                    tempArray.push(myChunk);
                }
                return tempArray;
            },
            childViews: {
                'CreateSalesOrders.List.Items': function() {
                    var recs = this.options.options;
                    var arr = this.chunkArray(recs, this.collection.models[0].get('recordsPerPage'));
                    recs = arr[this.page];
                    var records_collection = new Backbone.Collection(recs.map(function(CreateSalesOrdersModel) {
                        return new Backbone.Model({
                            title: CreateSalesOrdersModel['Name'],

                            internalid: CreateSalesOrdersModel.internalid,
                            showInModal: false,
                            generateRemoveButton: false,
                            columns: [{
                                    label: 'Description',
                                    type: 'description',
                                    name: 'description',
                                    value: CreateSalesOrdersModel['Description']
                                }, {
                                    label: 'Available Quantity',
                                    type: 'Available Quantity',
                                    name: 'Available Quantity',
                                    value: CreateSalesOrdersModel['Available']
                                }

                                , {
                                    label: 'On Hand Quantity',
                                    type: 'On Hand Quantity',
                                    name: 'On Hand Quantity',
                                    value: CreateSalesOrdersModel['On Hand']
                                }

                                , {
                                    label: 'Committed Quantity',
                                    type: 'Committed Quantity',
                                    name: 'Committed Quantity',
                                    value: CreateSalesOrdersModel['Committed']
                                }
                            ]
                        });
                    }));

                    return new BackboneCollectionView({
                        childView: RecordViewsView,
                        collection: records_collection,
                        viewsPerRow: 1
                    });

                },
                'GlobalViews.Pagination': function() {
                    return new GlobalViewsPaginationView(_.extend({
                        totalPages: Math.ceil(this.options.options.length / this.collection.models[0].get('recordsPerPage'))
                    }, Configuration.defaultPaginationSettings));
                },
                'GlobalViews.ShowCurrentPage': function() {
                    return new GlobalViewsShowingCurrentView({
                        items_per_page: this.collection.models[0].get('recordsPerPage'),
                        total_items: this.options.options.length,
                        total_pages: Math.ceil(this.options.options.length / this.collection.models[0].get('recordsPerPage'))
                    });
                },
                'List.Header': function() {
                    return this.listHeader;
                }
            },
            getSelectedMenu: function() {
                return 'createsalesorders';
            },
            // ,
            // getBreadcrumbPages: function() {
            //     return {
            //         text: 'Current Inventory'
            //     };
            // }


            // ,
            getContext: function() {    
                return {
                    Title: 'Place A New Sales Orders',
                    page_header: this.page_header,
                    collection: this.options.options, //collection,
                    searchFilterValue: this.searchFilterValue
                        // @property {Boolean} collectionLength
                        ,
                    collectionLength: this.options.options.length
                        // @property {Boolean} isLoading
                        ,
                    isLoading: this.isLoading
                        // @property {Boolean} showPagination
                        ,
                    showPagination: !!(this.options.options.length && this.collection.models[0].get('recordsPerPage'))
                        // @property {Boolean} showCurrentPage
                        ,
                    showCurrentPage: this.options.showCurrentPage
                };
            }
        });
    });