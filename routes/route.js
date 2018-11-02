'use strict';

const Middleware = require('../middleware/tokenauthorization');
const corsMiddleware = require('restify-cors-middleware');
const moment = require('moment');
const logger = require('../config/log');
var m_employee = require('../controllers/m_employee');
var m_company = require('../controllers/m_company');

var user = require('../controllers/m_user');

const msouvenir = require('../controllers/m_souvenir');
const tsitem = require('../controllers/t_souvenir_item');
const tsouvenir = require('../controllers/t_souvenir');


module.exports = exports = function(server){

    logger.info("Initializing Route Path" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

    var cors = corsMiddleware({
        origins : ['*'],
        allowHeaders : ['authorization']
    });

    server.pre(cors.preflight);
    server.use(cors.actual);

    logger.info("Restify Cors Middleware already set" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    logger.info("Route already accessed" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

    // Set Route Path Here
    // User
    server.post('/api/login', user.Login);
    server.get('/api/logout', user.Logout);
    server.get('/api/user/', Middleware.checkToken, user.GetAll);
    server.post('/api/user/:id', Middleware.checkToken, user.GetDetail);

    //Route m_souvenir
    server.get('/api/souvenir/', msouvenir.GetAll);
    server.get('/api/souvenir/:id', msouvenir.GetDetail);
    server.post('/api/souvenir/', msouvenir.Create);
    server.put('/api/souvenir/:id', msouvenir.Update);
    server.del('/api/souvenir/:id', msouvenir.Delete);

    //Route t_souvenir
    server.get('/api/tsouvenir/', tsouvenir.GetAll);
    server.get('/api/tsouvenir/:id', tsouvenir.GetDetail);
    // server.post('/api/souvenir/', msouvenir.Create);
    // server.put('/api/souvenir/:id', msouvenir.Update);
    // server.del('/api/souvenir/:id', msouvenir.Delete);

    //Route t_souvenir_item
    // server.get('/api/tsitem/', tsitem.GetAll);
    // server.get('/api/tsitem/:id', tsitem.GetDetail);
    // server.post('/api/tsitem/', tsitem.Create);
    // server.put('/api/tsitem/:id', tsitem.Update);
    // server.del('/api/tsitem/:id', tsitem.Delete);

    // Route Employee
    server.get('/api/employee/', m_employee.GetAll);
    server.get('/api/employee/:id', m_employee.GetDetail);
    server.post('/api/employee/', m_employee.Create);
    server.put('/api/employee/:id', m_employee.Update);
    server.del('/api/employee/:id', m_employee.Delete);

    //Route Company
    server.get('/api/company/', m_company.GetAll);
};