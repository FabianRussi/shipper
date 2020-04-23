define('CreateSalesOrders', ['CreateSalesOrders.Router'], function(
    Router
) {
    'use strict';

    return {
        MenuItems: {
            parent: 'orders',
            id: 'createsalesorders',
            name: 'Create Sales Orders',
            url: 'create-order',
            index: 0
        }

        ,
        mountToApp: function(application) {
            return new Router(application);
        }
    };
});