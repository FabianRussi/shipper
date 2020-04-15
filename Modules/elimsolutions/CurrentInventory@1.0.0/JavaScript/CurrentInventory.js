define('CurrentInventory'
    ,   [   'CurrentInventory.Router'
    ]
    ,   function (
        Router
    )
    {
        'use strict';

        return  {
            MenuItems: {
                parent: 'orders'
                ,   id: 'currentinventory'
                ,   name: 'Inventory Overview'
                ,   url: 'current-inventory?srch='
                ,   index: 4
            }

            ,   mountToApp: function (application)
            {
                return new Router(application);
            }
        };
    });
