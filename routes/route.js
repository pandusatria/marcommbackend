'use strict';

const Middleware = require('../middleware/tokenauthorization');
const corsMiddleware = require('restify-cors-middleware');
const moment = require('moment');
const logger = require('../config/log');
var m_employee = require('../controllers/m_employee');
var m_company = require('../controllers/m_company');
var m_user = require('../controllers/m_user');
const msouvenir = require('../controllers/m_souvenir');
const tsouvenir = require('../controllers/t_souvenir');
const munit = require('../controllers/m_unit');

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
	
    // Route User
    server.post('/api/login', m_user.Login);
    server.get('/api/logout', m_user.Logout);
    server.get('/api/user/', Middleware.checkToken, m_user.GetAll);
    server.get('/api/user/:id', Middleware.checkToken, m_user.GetDetail);
    server.post('/api/user/', Middleware.checkToken, m_user.Create);
    server.put('/api/user/:id', Middleware.checkToken, m_user.Update);
    server.del('/api/user/:id', Middleware.checkToken, m_user.Delete);

    //Route m_souvenir
    server.get('/api/souvenir/', Middleware.checkToken, msouvenir.GetAll);
    server.get('/api/souvenir/:id', Middleware.checkToken, msouvenir.GetDetail);
    server.post('/api/souvenir/', Middleware.checkToken, msouvenir.Create);
    server.put('/api/souvenir/:id', Middleware.checkToken, msouvenir.Update);
    server.del('/api/souvenir/:id', Middleware.checkToken, msouvenir.Delete);
    server.get('/api/souvenir/orderdesc', msouvenir.GetAllHandlerSortByDescending);
    server.post('/api/souvenir/search', Middleware.checkToken, msouvenir.GetAllHandlerSearch);

    //Route t_souvenir
    server.get('/api/tsouvenir/', Middleware.checkToken, tsouvenir.GetAll);
    server.get('/api/tsouvenir/:id', Middleware.checkToken, tsouvenir.GetDetail);
    server.post('/api/tsouvenir/search', Middleware.checkToken, tsouvenir.GetAllHandlerSearch);

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

    //Route Unit
    server.get('/api/unit/',Middleware.checkToken, munit.GetAll);
};