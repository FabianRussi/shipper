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
            events: {
                'click .delete-item': 'removeItem',
                'click #add-items': 'addItemRow',
                'keyup [data-type="curr-inv-srch"]': 'searchFilter',
                'click [data-type="goSearch"]': 'goSearch',
                'change #items': 'showAmount',
                'click #plase-order': 'createSlesOrder'
            },
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
                this.locations = this.options.collection.models[0].get("locations");
                this.taxcode = this.options.collection.models[0].get("TaxsCode")

                console.log('Backbone.history.fragment : ' + Backbone.history.fragment);
                jQuery('.curr-inv-srch').focus();
                BackboneCompositeView.add(this);
                sessionStorage.removeItem('jsonItem');

            },
            _getPageFromUrl: function(url_value) {
                var page_number = parseInt(url_value, 10);
                return !isNaN(page_number) && page_number > 0 ? page_number : 1;
            },

            addItemRow: function(e) {
                debugger;
                e.preventDefault();
                var qty = 1;
                var string = '';
                string += '<tr data-attr="' + jQuery('#items option:selected').val() + ";" + jQuery('#taxcode option:selected').text() + ";" + jQuery('#locations option:selected').val() + '" id="itemid-' + jQuery('#items option:selected').val() + '" class="trclass">'
                string += '<td><img src="https://5445214.app.netsuite.com/c.5445214/SSP Applications/eShipper+_5445214/uat/img/eshipper_logo.jpg" alt=""> </td>'
                string += '<td >' + jQuery('#items option:selected').text() + '</td>'
                string += '<td> amount: <span> ' + jQuery('#amount').val() + '</span> </td>'
                string += '<td> qty: <span> ' + jQuery('#qty').val() + '</span> </td>'
                string += '<td> <button type="button" id="itemremove-' + jQuery('#items option:selected').val() + '" class="delete-item">×</button> </td> </tr>'
                jQuery('#table-summary').append(string);
                var arrayItems = sessionStorage.getItem('jsonItem');
                if (arrayItems) {
                    arrayItems = JSON.parse(arrayItems);
                    arrayItems.push({
                        itemid: jQuery('#items option:selected').val(),
                        qty: jQuery('#qty').val(),
                        amount: jQuery('#amount').val(),
                        tax: jQuery('#taxcode option:selected').text(),
                        locations: jQuery('#locations option:selected').val(),
                    });
                    sessionStorage.setItem('jsonItem', JSON.stringify(arrayItems));
                } else {
                    arrayItems = [{
                        itemid: jQuery('#items option:selected').val(),
                        qty: jQuery('#qty').val(),
                        amount: jQuery('#amount').val(),
                        tax: jQuery('#taxcode option:selected').text(),
                        locations: jQuery('#locations option:selected').val()
                    }];
                    var customerId = '';
                    sessionStorage.setItem('jsonItem', JSON.stringify(arrayItems));
                }

            },
            removeItem: function(e) {
                var id = e.currentTarget.id;
                var idRemove = id.replace("itemremove-", "");
                var attr = jQuery(e.currentTarget).parent('td').parent('tr').attr('data-attr');
                jQuery(e.currentTarget).parent('td').parent('tr').remove();
                var arrayItems = JSON.parse(sessionStorage.getItem('jsonItem'));
                var resultArray = _.filter(arrayItems, function(item) {
                    return (item.itemid != idRemove) || (item.locations != attr.split(';')[2] || item.tax != attr.split(';')[1]);
                })
                sessionStorage.setItem('jsonItem', JSON.stringify(resultArray));
            },
            listenCollection: function() {
                this.setLoading(true);

                this.collection.on({
                    request: _.bind(this.setLoading, this, true),
                    reset: _.bind(this.setLoading, this, false)
                });

                console.log(this.options);

                this.setLoading(false);
            },
            showAmount: function(e) {
                var selected = _.filter(this.collection.models[0].get('records'), function(item) {
                    return item.Name == jQuery('#items option:selected').text();
                })
                jQuery('#amount').val(selected[0]['Base Price']);
            },
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
            },
            //Btn submit
            createSlesOrder: function() {
                debugger;
                var addresses = jQuery('#addressesee  option:selected').val();
                var formData = sessionStorage.getItem('jsonItem');
                var arrData = JSON.parse(formData);
                if (addresses == '') {
                    jQuery('#messageAddress').html('teeees');
                    arrData.push({
                        postalCode: jQuery('#postalCode').val(),
                        addr1: jQuery('#addr1').val(),
                        addr2: jQuery('#addr2').val(),
                        city: jQuery('#customer').val()
                    })
                } else {
                    arrData.push({ addresses: addresses });
                }
                arrData.push({
                    orderNumber: jQuery('#orderNumber').val(),
                    memo: jQuery('#memo').val(),
                    customer: jQuery('#city').val()

                })
                sessionStorage.setItem('jsonItem', JSON.stringify(arrData));
                var jsonInfoForm = sessionStorage.getItem('jsonItem');
                this.returnCreatesalesOrder(jsonInfoForm);
                console.log('response', jsonInfoForm)
            },


            returnCreatesalesOrder: function(jsonInfoForm) {
                var message = '';
                debugger;
                jQuery.ajax({
                        method: "GET",
                        url: "/app/site/hosting/scriptlet.nl?script=892&deploy=1&compid=5445214&h=217e3241105accc13a29&jsonInfoForm=" + jsonInfoForm,
                        dataType: "json"
                    })
                    .done(function(msg) {

                    })


            },
            setLoading: function(is_loading) {
                //@property {Boolean} isLoading
                this.isLoading = is_loading;
            },
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
                    addresses: this.options.addresses.models,
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
                    showCurrentPage: this.options.showCurrentPage,
                    locations: this.locations,
                    taxcode: this.taxcode
                };
            }
        });
    });