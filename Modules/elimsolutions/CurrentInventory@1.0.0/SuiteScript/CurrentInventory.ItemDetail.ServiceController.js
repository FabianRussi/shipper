define(
    'CurrentInventory.ItemDetail.ServiceController'
    , [
        'ServiceController'
        , 'CurrentInventory.ItemDetail.Model'
    ]
    , function (
        ServiceController
        , CurrentInventoryItemDetailModel
    ) {
        'use strict';
        return ServiceController.extend({
            name: 'CurrentInventory.ItemDetail.ServiceController'
            , options: {
                common: {
                    requireSecure: true
                }
            }
            , get: function () {
                return CurrentInventoryItemDetailModel.getInventoryItem(id);
            }
        });
    }
);