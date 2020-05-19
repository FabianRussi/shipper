function service(request, response) {
    // gain access to methods on Application object
    var Application = require('Application');
    try {

        console.log("session", session);

        var CurrentInventory = require('CurrentInventory.Model');
        if (request.getMethod() === 'GET') {
            Application.sendContent(CurrentInventory.listAll());
        }


    } catch (es) {
        Application.sendError(es);
    }
}