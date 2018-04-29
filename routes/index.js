/**
 * Created by Ferenc on 29/04/2018.
 */

const controllers = require('../controllers/controllers');

module.exports = function (app) {
    app.get('/', controllers.home);
    app.get('/messages', controllers.getAllMessages);
    app.get('/messages/:id', controllers.getMessage);
    app.post('/messages', controllers.addMessage);
    app.post('/admin/cache/clear', controllers.clearCache);
    app.post('/admin/cache', controllers.setCacheTtl);
};