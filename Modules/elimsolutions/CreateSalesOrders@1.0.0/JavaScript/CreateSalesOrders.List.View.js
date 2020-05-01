define(
    'CreateSalesOrders.List.View', ['create_sales_order_list.tpl', 'Backbone', 'Backbone.CompositeView', 'Backbone.CollectionView', 'RecordViews.View', 'ListHeader.View', 'GlobalViews.Pagination.View', 'GlobalViews.ShowingCurrent.View', 'SC.Configuration', 'jQuery', 'underscore'],
    function(
        create_sales_order_list, Backbone, BackboneCompositeView, BackboneCollectionView, RecordViewsView, ListHeaderView, GlobalViewsPaginationView, GlobalViewsShowingCurrentView, Configuration, jQuery, _


    ) {
        'use strict';

        return Backbone.View.extend({

            template: create_sales_order_list,
            attributes: { 'class': 'CreateSalesOrdersListView' },
            events: {
                'click .delete-item': 'removeItem',
                'click #add-items': 'addItemRow',
                'keyup [data-type="curr-inv-srch"]': 'searchFilter',
                'click [data-type="goSearch"]': 'goSearch',
                'change #items': 'showAmount',
                'click #place-order': 'createSlesOrder',
                'click': 'annoyUser'
            },
            title: _('Place A New Sales Order').translate(),
            page_header: _('Create sale order').translate(),
            searchFilterValue: '',
            filteredResults: [],
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
                this.taxcode = this.options.collection.models[0].get("TaxsCode");
                this.countries = this.getCountry();
                this.customerId = this.options.customerId;

                jQuery('.curr-inv-srch').focus();
                BackboneCompositeView.add(this);
                sessionStorage.removeItem('jsonItem');
            },
            _getPageFromUrl: function(url_value) {
                var page_number = parseInt(url_value, 10);
                return !isNaN(page_number) && page_number > 0 ? page_number : 1;
            },

            addItemRow: function(e) {

                e.preventDefault();
                //  var qty = 1;
                var string = '';
                string += '<tr data-attr="' + jQuery('#items option:selected').val() + ";" + jQuery('#taxcode option:selected').text() + ";" + jQuery('#locations option:selected').val() + '" id="itemid-' + jQuery('#items option:selected').val() + '" class="trclass">'
                string += '<td><img src="https://5445214.app.netsuite.com/c.5445214/SSP Applications/eShipper+_5445214/uat/img/eshipper_logo.jpg" alt=""> </td>'
                string += '<td >' + jQuery('#items option:selected').text() + '</td>'
                string += '<td> Qty: <span> ' + jQuery('#qty').val() + '</span> </td>'
                string += '<td> <button type="button" id="itemremove-' + jQuery('#items option:selected').val() + '" class="delete-item">×</button> </td> </tr>'
                string += '<td style="display:none"> amount: <span> ' + jQuery('#amount').val() + '</span> </td>'

                var item = jQuery('#items option:selected').val();
                var qty = jQuery('#qty').val();
                var location = jQuery('#locations option:selected').text();
                var arrayItems = sessionStorage.getItem('jsonItem');

                var addItem = this.qtyAvailable(qty, item, location)
                if (addItem.available) {
                    jQuery('#table-summary').append(string);
                    if (arrayItems) {
                        arrayItems = JSON.parse(arrayItems);
                        arrayItems.push({
                            itemid: item,
                            qty: qty,
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
                            locations: jQuery('#locations option:selected').val(),

                        }];
                        var customerId = this.customerId;
                        sessionStorage.setItem('jsonItem', JSON.stringify(arrayItems));
                    }
                } else {
                    alert(addItem.message);
                }
                sessionStorage.setItem('addItems', 'true')
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
            qtyAvailable: function(val, id, location) {
                var available = true;
                var obj = {};
                var selected = _.filter(this.collection.models[0].get('records'), function(item) {

                    return item.id == id;
                })
                if (parseInt(selected[0].Available) <= parseInt(val)) {
                    available = false;
                    obj.message = 'The quantity available for this item is ' + selected[0].Available;
                } else if (selected[0].Location.name != location || location == '') {
                    obj.message = 'No inventory in this location';
                    available = false;
                }

                obj.available = available;
                return obj;
            },

            getCountry: function() {

                var countries = [{
                        "value": "",
                        "text": ""
                    },
                    {
                        "value": "AF",
                        "text": "Afghanistan"
                    },
                    {
                        "value": "AX",
                        "text": "Aland Islands"
                    },
                    {
                        "value": "AL",
                        "text": "Albania"
                    },
                    {
                        "value": "DZ",
                        "text": "Algeria"
                    },
                    {
                        "value": "AS",
                        "text": "American Samoa"
                    },
                    {
                        "value": "AD",
                        "text": "Andorra"
                    },
                    {
                        "value": "AO",
                        "text": "Angola"
                    },
                    {
                        "value": "AI",
                        "text": "Anguilla"
                    },
                    {
                        "value": "AQ",
                        "text": "Antarctica"
                    },
                    {
                        "value": "AG",
                        "text": "Antigua and Barbuda"
                    },
                    {
                        "value": "AR",
                        "text": "Argentina"
                    },
                    {
                        "value": "AM",
                        "text": "Armenia"
                    },
                    {
                        "value": "AW",
                        "text": "Aruba"
                    },
                    {
                        "value": "AU",
                        "text": "Australia"
                    },
                    {
                        "value": "AT",
                        "text": "Austria"
                    },
                    {
                        "value": "AZ",
                        "text": "Azerbaijan"
                    },
                    {
                        "value": "BS",
                        "text": "Bahamas"
                    },
                    {
                        "value": "BH",
                        "text": "Bahrain"
                    },
                    {
                        "value": "BD",
                        "text": "Bangladesh"
                    },
                    {
                        "value": "BB",
                        "text": "Barbados"
                    },
                    {
                        "value": "BY",
                        "text": "Belarus"
                    },
                    {
                        "value": "BE",
                        "text": "Belgium"
                    },
                    {
                        "value": "BZ",
                        "text": "Belize"
                    },
                    {
                        "value": "BJ",
                        "text": "Benin"
                    },
                    {
                        "value": "BM",
                        "text": "Bermuda"
                    },
                    {
                        "value": "BT",
                        "text": "Bhutan"
                    },
                    {
                        "value": "BO",
                        "text": "Bolivia"
                    },
                    {
                        "value": "BQ",
                        "text": "Bonaire, Saint Eustatius and Saba"
                    },
                    {
                        "value": "BA",
                        "text": "Bosnia and Herzegovina"
                    },
                    {
                        "value": "BW",
                        "text": "Botswana"
                    },
                    {
                        "value": "BV",
                        "text": "Bouvet Island"
                    },
                    {
                        "value": "BR",
                        "text": "Brazil"
                    },
                    {
                        "value": "IO",
                        "text": "British Indian Ocean Territory"
                    },
                    {
                        "value": "BN",
                        "text": "Brunei Darussalam"
                    },
                    {
                        "value": "BG",
                        "text": "Bulgaria"
                    },
                    {
                        "value": "BF",
                        "text": "Burkina Faso"
                    },
                    {
                        "value": "BI",
                        "text": "Burundi"
                    },
                    {
                        "value": "KH",
                        "text": "Cambodia"
                    },
                    {
                        "value": "CM",
                        "text": "Cameroon"
                    },
                    {
                        "value": "CA",
                        "text": "Canada"
                    },
                    {
                        "value": "IC",
                        "text": "Canary Islands"
                    },
                    {
                        "value": "CV",
                        "text": "Cape Verde"
                    },
                    {
                        "value": "KY",
                        "text": "Cayman Islands"
                    },
                    {
                        "value": "CF",
                        "text": "Central African Republic"
                    },
                    {
                        "value": "EA",
                        "text": "Ceuta and Melilla"
                    },
                    {
                        "value": "TD",
                        "text": "Chad"
                    },
                    {
                        "value": "CL",
                        "text": "Chile"
                    },
                    {
                        "value": "CN",
                        "text": "China"
                    },
                    {
                        "value": "CX",
                        "text": "Christmas Island"
                    },
                    {
                        "value": "CC",
                        "text": "Cocos (Keeling) Islands"
                    },
                    {
                        "value": "CO",
                        "text": "Colombia"
                    },
                    {
                        "value": "KM",
                        "text": "Comoros"
                    },
                    {
                        "value": "CD",
                        "text": "Congo, Democratic Republic of"
                    },
                    {
                        "value": "CG",
                        "text": "Congo, Republic of"
                    },
                    {
                        "value": "CK",
                        "text": "Cook Islands"
                    },
                    {
                        "value": "CR",
                        "text": "Costa Rica"
                    },
                    {
                        "value": "CI",
                        "text": "Cote d\u0027Ivoire"
                    },
                    {
                        "value": "HR",
                        "text": "Croatia/Hrvatska"
                    },
                    {
                        "value": "CU",
                        "text": "Cuba"
                    },
                    {
                        "value": "CW",
                        "text": "Curaçao"
                    },
                    {
                        "value": "CY",
                        "text": "Cyprus"
                    },
                    {
                        "value": "CZ",
                        "text": "Czech Republic"
                    },
                    {
                        "value": "DK",
                        "text": "Denmark"
                    },
                    {
                        "value": "DJ",
                        "text": "Djibouti"
                    },
                    {
                        "value": "DM",
                        "text": "Dominica"
                    },
                    {
                        "value": "DO",
                        "text": "Dominican Republic"
                    },
                    {
                        "value": "TL",
                        "text": "East Timor"
                    },
                    {
                        "value": "EC",
                        "text": "Ecuador"
                    },
                    {
                        "value": "EG",
                        "text": "Egypt"
                    },
                    {
                        "value": "SV",
                        "text": "El Salvador"
                    },
                    {
                        "value": "GQ",
                        "text": "Equatorial Guinea"
                    },
                    {
                        "value": "ER",
                        "text": "Eritrea"
                    },
                    {
                        "value": "EE",
                        "text": "Estonia"
                    },
                    {
                        "value": "ET",
                        "text": "Ethiopia"
                    },
                    {
                        "value": "FK",
                        "text": "Falkland Islands"
                    },
                    {
                        "value": "FO",
                        "text": "Faroe Islands"
                    },
                    {
                        "value": "FJ",
                        "text": "Fiji"
                    },
                    {
                        "value": "FI",
                        "text": "Finland"
                    },
                    {
                        "value": "FR",
                        "text": "France"
                    },
                    {
                        "value": "GF",
                        "text": "French Guiana"
                    },
                    {
                        "value": "PF",
                        "text": "French Polynesia"
                    },
                    {
                        "value": "TF",
                        "text": "French Southern Territories"
                    },
                    {
                        "value": "GA",
                        "text": "Gabon"
                    },
                    {
                        "value": "GM",
                        "text": "Gambia"
                    },
                    {
                        "value": "GE",
                        "text": "Georgia"
                    },
                    {
                        "value": "DE",
                        "text": "Germany"
                    },
                    {
                        "value": "GH",
                        "text": "Ghana"
                    },
                    {
                        "value": "GI",
                        "text": "Gibraltar"
                    },
                    {
                        "value": "GR",
                        "text": "Greece"
                    },
                    {
                        "value": "GL",
                        "text": "Greenland"
                    },
                    {
                        "value": "GD",
                        "text": "Grenada"
                    },
                    {
                        "value": "GP",
                        "text": "Guadeloupe"
                    },
                    {
                        "value": "GU",
                        "text": "Guam"
                    },
                    {
                        "value": "GT",
                        "text": "Guatemala"
                    },
                    {
                        "value": "GG",
                        "text": "Guernsey"
                    },
                    {
                        "value": "GN",
                        "text": "Guinea"
                    },
                    {
                        "value": "GW",
                        "text": "Guinea-Bissau"
                    },
                    {
                        "value": "GY",
                        "text": "Guyana"
                    },
                    {
                        "value": "HT",
                        "text": "Haiti"
                    },
                    {
                        "value": "HM",
                        "text": "Heard and McDonald Islands"
                    },
                    {
                        "value": "VA",
                        "text": "Holy See (City Vatican State)"
                    },
                    {
                        "value": "HN",
                        "text": "Honduras"
                    },
                    {
                        "value": "HK",
                        "text": "Hong Kong"
                    },
                    {
                        "value": "HU",
                        "text": "Hungary"
                    },
                    {
                        "value": "IS",
                        "text": "Iceland"
                    },
                    {
                        "value": "IN",
                        "text": "India"
                    },
                    {
                        "value": "ID",
                        "text": "Indonesia"
                    },
                    {
                        "value": "IR",
                        "text": "Iran (Islamic Republic of)"
                    },
                    {
                        "value": "IQ",
                        "text": "Iraq"
                    },
                    {
                        "value": "IE",
                        "text": "Ireland"
                    },
                    {
                        "value": "IM",
                        "text": "Isle of Man"
                    },
                    {
                        "value": "IL",
                        "text": "Israel"
                    },
                    {
                        "value": "IT",
                        "text": "Italy"
                    },
                    {
                        "value": "JM",
                        "text": "Jamaica"
                    },
                    {
                        "value": "JP",
                        "text": "Japan"
                    },
                    {
                        "value": "JE",
                        "text": "Jersey"
                    },
                    {
                        "value": "JO",
                        "text": "Jordan"
                    },
                    {
                        "value": "KZ",
                        "text": "Kazakhstan"
                    },
                    {
                        "value": "KE",
                        "text": "Kenya"
                    },
                    {
                        "value": "KI",
                        "text": "Kiribati"
                    },
                    {
                        "value": "KP",
                        "text": "Korea, Democratic People\u0027s Republic"
                    },
                    {
                        "value": "KR",
                        "text": "Korea, Republic of"
                    },
                    {
                        "value": "XK",
                        "text": "Kosovo"
                    },
                    {
                        "value": "KW",
                        "text": "Kuwait"
                    },
                    {
                        "value": "KG",
                        "text": "Kyrgyzstan"
                    },
                    {
                        "value": "LA",
                        "text": "Lao People\u0027s Democratic Republic"
                    },
                    {
                        "value": "LV",
                        "text": "Latvia"
                    },
                    {
                        "value": "LB",
                        "text": "Lebanon"
                    },
                    {
                        "value": "LS",
                        "text": "Lesotho"
                    },
                    {
                        "value": "LR",
                        "text": "Liberia"
                    },
                    {
                        "value": "LY",
                        "text": "Libya"
                    },
                    {
                        "value": "LI",
                        "text": "Liechtenstein"
                    },
                    {
                        "value": "LT",
                        "text": "Lithuania"
                    },
                    {
                        "value": "LU",
                        "text": "Luxembourg"
                    },
                    {
                        "value": "MO",
                        "text": "Macau"
                    },
                    {
                        "value": "MK",
                        "text": "Macedonia"
                    },
                    {
                        "value": "MG",
                        "text": "Madagascar"
                    },
                    {
                        "value": "MW",
                        "text": "Malawi"
                    },
                    {
                        "value": "MY",
                        "text": "Malaysia"
                    },
                    {
                        "value": "MV",
                        "text": "Maldives"
                    },
                    {
                        "value": "ML",
                        "text": "Mali"
                    },
                    {
                        "value": "MT",
                        "text": "Malta"
                    },
                    {
                        "value": "MH",
                        "text": "Marshall Islands"
                    },
                    {
                        "value": "MQ",
                        "text": "Martinique"
                    },
                    {
                        "value": "MR",
                        "text": "Mauritania"
                    },
                    {
                        "value": "MU",
                        "text": "Mauritius"
                    },
                    {
                        "value": "YT",
                        "text": "Mayotte"
                    },
                    {
                        "value": "MX",
                        "text": "Mexico"
                    },
                    {
                        "value": "FM",
                        "text": "Micronesia, Federal State of"
                    },
                    {
                        "value": "MD",
                        "text": "Moldova, Republic of"
                    },
                    {
                        "value": "MC",
                        "text": "Monaco"
                    },
                    {
                        "value": "MN",
                        "text": "Mongolia"
                    },
                    {
                        "value": "ME",
                        "text": "Montenegro"
                    },
                    {
                        "value": "MS",
                        "text": "Montserrat"
                    },
                    {
                        "value": "MA",
                        "text": "Morocco"
                    },
                    {
                        "value": "MZ",
                        "text": "Mozambique"
                    },
                    {
                        "value": "MM",
                        "text": "Myanmar (Burma)"
                    },
                    {
                        "value": "NA",
                        "text": "Namibia"
                    },
                    {
                        "value": "NR",
                        "text": "Nauru"
                    },
                    {
                        "value": "NP",
                        "text": "Nepal"
                    },
                    {
                        "value": "NL",
                        "text": "Netherlands"
                    },
                    {
                        "value": "AN",
                        "text": "Netherlands Antilles (Deprecated)"
                    },
                    {
                        "value": "NC",
                        "text": "New Caledonia"
                    },
                    {
                        "value": "NZ",
                        "text": "New Zealand"
                    },
                    {
                        "value": "NI",
                        "text": "Nicaragua"
                    },
                    {
                        "value": "NE",
                        "text": "Niger"
                    },
                    {
                        "value": "NG",
                        "text": "Nigeria"
                    },
                    {
                        "value": "NU",
                        "text": "Niue"
                    },
                    {
                        "value": "NF",
                        "text": "Norfolk Island"
                    },
                    {
                        "value": "MP",
                        "text": "Northern Mariana Islands"
                    },
                    {
                        "value": "NO",
                        "text": "Norway"
                    },
                    {
                        "value": "OM",
                        "text": "Oman"
                    },
                    {
                        "value": "PK",
                        "text": "Pakistan"
                    },
                    {
                        "value": "PW",
                        "text": "Palau"
                    },
                    {
                        "value": "PA",
                        "text": "Panama"
                    },
                    {
                        "value": "PG",
                        "text": "Papua New Guinea"
                    },
                    {
                        "value": "PY",
                        "text": "Paraguay"
                    },
                    {
                        "value": "PE",
                        "text": "Peru"
                    },
                    {
                        "value": "PH",
                        "text": "Philippines"
                    },
                    {
                        "value": "PN",
                        "text": "Pitcairn Island"
                    },
                    {
                        "value": "PL",
                        "text": "Poland"
                    },
                    {
                        "value": "PT",
                        "text": "Portugal"
                    },
                    {
                        "value": "PR",
                        "text": "Puerto Rico"
                    },
                    {
                        "value": "QA",
                        "text": "Qatar"
                    },
                    {
                        "value": "RE",
                        "text": "Reunion Island"
                    },
                    {
                        "value": "RO",
                        "text": "Romania"
                    },
                    {
                        "value": "RU",
                        "text": "Russian Federation"
                    },
                    {
                        "value": "RW",
                        "text": "Rwanda"
                    },
                    {
                        "value": "BL",
                        "text": "Saint Barthélemy"
                    },
                    {
                        "value": "SH",
                        "text": "Saint Helena"
                    },
                    {
                        "value": "KN",
                        "text": "Saint Kitts and Nevis"
                    },
                    {
                        "value": "LC",
                        "text": "Saint Lucia"
                    },
                    {
                        "value": "MF",
                        "text": "Saint Martin"
                    },
                    {
                        "value": "VC",
                        "text": "Saint Vincent and the Grenadines"
                    },
                    {
                        "value": "WS",
                        "text": "Samoa"
                    },
                    {
                        "value": "SM",
                        "text": "San Marino"
                    },
                    {
                        "value": "ST",
                        "text": "Sao Tome and Principe"
                    },
                    {
                        "value": "SA",
                        "text": "Saudi Arabia"
                    },
                    {
                        "value": "SN",
                        "text": "Senegal"
                    },
                    {
                        "value": "RS",
                        "text": "Serbia"
                    },
                    {
                        "value": "CS",
                        "text": "Serbia and Montenegro (Deprecated)"
                    },
                    {
                        "value": "SC",
                        "text": "Seychelles"
                    },
                    {
                        "value": "SL",
                        "text": "Sierra Leone"
                    },
                    {
                        "value": "SG",
                        "text": "Singapore"
                    },
                    {
                        "value": "SX",
                        "text": "Sint Maarten"
                    },
                    {
                        "value": "SK",
                        "text": "Slovak Republic"
                    },
                    {
                        "value": "SI",
                        "text": "Slovenia"
                    },
                    {
                        "value": "SB",
                        "text": "Solomon Islands"
                    },
                    {
                        "value": "SO",
                        "text": "Somalia"
                    },
                    {
                        "value": "ZA",
                        "text": "South Africa"
                    },
                    {
                        "value": "GS",
                        "text": "South Georgia"
                    },
                    {
                        "value": "SS",
                        "text": "South Sudan"
                    },
                    {
                        "value": "ES",
                        "text": "Spain"
                    },
                    {
                        "value": "LK",
                        "text": "Sri Lanka"
                    },
                    {
                        "value": "PM",
                        "text": "St. Pierre and Miquelon"
                    },
                    {
                        "value": "PS",
                        "text": "State of Palestine"
                    },
                    {
                        "value": "SD",
                        "text": "Sudan"
                    },
                    {
                        "value": "SR",
                        "text": "Suriname"
                    },
                    {
                        "value": "SJ",
                        "text": "Svalbard and Jan Mayen Islands"
                    },
                    {
                        "value": "SZ",
                        "text": "Swaziland"
                    },
                    {
                        "value": "SE",
                        "text": "Sweden"
                    },
                    {
                        "value": "CH",
                        "text": "Switzerland"
                    },
                    {
                        "value": "SY",
                        "text": "Syrian Arab Republic"
                    },
                    {
                        "value": "TW",
                        "text": "Taiwan"
                    },
                    {
                        "value": "TJ",
                        "text": "Tajikistan"
                    },
                    {
                        "value": "TZ",
                        "text": "Tanzania"
                    },
                    {
                        "value": "TH",
                        "text": "Thailand"
                    },
                    {
                        "value": "TG",
                        "text": "Togo"
                    },
                    {
                        "value": "TK",
                        "text": "Tokelau"
                    },
                    {
                        "value": "TO",
                        "text": "Tonga"
                    },
                    {
                        "value": "TT",
                        "text": "Trinidad and Tobago"
                    },
                    {
                        "value": "TN",
                        "text": "Tunisia"
                    },
                    {
                        "value": "TR",
                        "text": "Turkey"
                    },
                    {
                        "value": "TM",
                        "text": "Turkmenistan"
                    },
                    {
                        "value": "TC",
                        "text": "Turks and Caicos Islands"
                    },
                    {
                        "value": "TV",
                        "text": "Tuvalu"
                    },
                    {
                        "value": "UG",
                        "text": "Uganda"
                    },
                    {
                        "value": "UA",
                        "text": "Ukraine"
                    },
                    {
                        "value": "AE",
                        "text": "United Arab Emirates"
                    },
                    {
                        "value": "GB",
                        "text": "United Kingdom"
                    },
                    {
                        "value": "US",
                        "text": "United States"
                    },
                    {
                        "value": "UY",
                        "text": "Uruguay"
                    },
                    {
                        "value": "UM",
                        "text": "US Minor Outlying Islands"
                    },
                    {
                        "value": "UZ",
                        "text": "Uzbekistan"
                    },
                    {
                        "value": "VU",
                        "text": "Vanuatu"
                    },
                    {
                        "value": "VE",
                        "text": "Venezuela"
                    },
                    {
                        "value": "VN",
                        "text": "Vietnam"
                    },
                    {
                        "value": "VG",
                        "text": "Virgin Islands (British)"
                    },
                    {
                        "value": "VI",
                        "text": "Virgin Islands (USA)"
                    },
                    {
                        "value": "WF",
                        "text": "Wallis and Futuna"
                    },
                    {
                        "value": "EH",
                        "text": "Western Sahara"
                    },
                    {
                        "value": "YE",
                        "text": "Yemen"
                    },
                    {
                        "value": "ZM",
                        "text": "Zambia"
                    },
                    {
                        "value": "ZW",
                        "text": "Zimbabwe"
                    }
                ]
                return countries;
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
                var addresses = jQuery('#addressesee  option:selected').val();
                var formData = sessionStorage.getItem('jsonItem');
                var arrData = JSON.parse(formData);
                if (addresses) {
                    arrData.push({ addresses: addresses });
                }
                if (addresses == '' && jQuery('#postalCode').val() == '') {
                    // 
                    this.completeField();
                    alert('If I do not select an address, you must complete the fields for shipping address');
                    return;
                } else {
                    arrData.push({
                        postalCode: jQuery('#postalCode').val(),
                        addr1: jQuery('#addr1').val(),
                        addr2: jQuery('#addr2').val(),
                        city: jQuery('#city').val(),
                        country: jQuery('#country option:selected').val()
                    })
                }
                arrData.push({
                    orderNumber: jQuery('#orderNumber').val(),
                    memo: jQuery('#memo').val(),
                    customer: jQuery('#customer').val(),
                    customerId: this.customerId
                })
                sessionStorage.setItem('jsonItem', JSON.stringify(arrData));
                this.returnCreatesalesOrder(sessionStorage.getItem('jsonItem'));
                console.log('jsonItem', sessionStorage.getItem('jsonItem'))
            },

            returnCreatesalesOrder: function(jsonInfoForm) {
                var response;
                jQuery.ajax({
                        method: "GET",
                        url: "/app/site/hosting/scriptlet.nl?script=892&deploy=1&compid=5445214&h=217e3241105accc13a29&jsonInfoForm=" + jsonInfoForm,
                        dataType: "json",
                        cache: false,
                        async: true

                    })
                    .done(function(msg) {
                        if (msg.soNumber) {
                            response = msg;
                            var msj;
                            jQuery(':input').val('');
                            jQuery('#postalCode').removeAttr('style');
                            jQuery('#addr1').removeAttr('style');
                            jQuery('#addr2').removeAttr('style');
                            jQuery('#city').removeAttr('style');
                            jQuery('#country').removeAttr('style');
                            jQuery('#table-summary').children().remove();
                            sessionStorage.removeItem('jsonItem');
                            alert('Sale order id ' + response.idOrder + '-' + 'Number of order ' + response.soNumber);
                        } else {
                            alert('The order is purchased has not been created, check the entered data');
                        }
                    })
            },

            completeField: function() {
                jQuery('#postalCode').css('background-color', '#ffff52')
                jQuery('#addr1').css('background-color', '#ffff52')
                jQuery('#addr2').css('background-color', '#ffff52')
                jQuery('#city').css('background-color', '#ffff52')
                jQuery('#country').css('background-color', '#ffff52')
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
            },
            goSearch: function() {

                var value = jQuery("#currInv").val();
                var url = window.location.href;
                var gurl = _.setUrlParameter(url, 'srch', value);
                var gurl2 = _.setUrlParameter(gurl, 'page', '0');
                console.log(gurl2);
                window.location.href = gurl2;
            },
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

            getBreadcrumbPages: function() {
                return {
                    text: 'Create New Order'
                };
            },
            getContext: function() {

                return {
                    Title: 'Place A New Sales Orders',
                    page_header: this.page_header,
                    collection: this.options.options, //collection,
                    addresses: this.options.addresses.models,
                    searchFilterValue: this.searchFilterValue,
                    countries: this.countries

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
                    taxcode: this.taxcode,
                    showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
                };
            }
        });
    });