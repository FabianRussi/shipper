function service(request, response) {
    // gain access to methods on Application object
    var Application = require('Application');
    try {

        console.log("session", session);

        var CreateSalesOrders = require('CreateSalesOrders.Model');
        if (request.getMethod() === 'GET') {
            Application.sendContent(CreateSalesOrders.listAll());
        }


    } catch (es) {
        Application.sendError(es);
    }
}