define('CurrentInventory.Collection'
    ,   [  'CurrentInventory.Model'

        ,	'underscore'
        ,	'Backbone'
        ,	'Utils'
    ]
    ,   function (
        CurrentInventoryModel

        ,	_
        ,	Backbone
    )
    {
        'use strict';

        return Backbone.Collection.extend(
            {
                model: CurrentInventoryModel

                ,	initialize: function (response)
                {



                    // this.totalRecordsFound = response.totalRecordsFound;
                    // this.recordsPerPage = response.recordsPerPage;

                }

            });
    });
