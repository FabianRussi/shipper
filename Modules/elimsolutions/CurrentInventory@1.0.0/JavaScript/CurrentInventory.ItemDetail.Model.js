define('CurrentInventory.ItemDetail.Model'
    , ['Backbone'
    ]
    , function (
        Backbone
    ) {
        'use strict';
        ///app/site/hosting/scriptlet.nl?script=customscript_es_get_curr_inv_items&deploy=1&esID=640
        return Backbone.Model.extend(
            {
                urlRoot: 'services/CurrentInventory.ItemDetail.service.ss'
            });
    });