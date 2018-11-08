'use strict';

const Middleware = require('../middleware/tokenauthorization');
const corsMiddleware = require('restify-cors-middleware');
const moment = require('moment');
const logger = require('../config/log');

var m_employee = require('../controllers/m_employee');
var m_company = require('../controllers/m_company');
var m_user = require('../controllers/m_user');
var validasi = require('../controllers/validate');
var t_event = require('../controllers/t_event');
var msouvenir = require('../controllers/m_souvenir');
var tsouvenir = require('../controllers/t_souvenir');
var t_sitem = require('../controllers/t_souvenir_item');
var m_role = require('../controllers/m_role');
var munit = require('../controllers/m_unit');

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
    server.post('/api/user/search', Middleware.checkToken, m_user.Search);

    // Route Role
    server.get('/api/role/', Middleware.checkToken, m_role.GetAll);

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
    server.get('/api/tsitem/', Middleware.checkToken, t_sitem.GetAll);
    server.get('/api/tsitem/:id', Middleware.checkToken, t_sitem.GetDetail);
    server.post('/api/tsitem/', Middleware.checkToken, t_sitem.Create);
    server.put('/api/tsitem/:id', Middleware.checkToken, t_sitem.Update);
    server.del('/api/tsitem/:id', Middleware.checkToken, t_sitem.Delete);
    server.post('/api/tsitem/search', Middleware.checkToken, t_sitem.Search);

    // Route Employee
    server.get('/api/employee/', Middleware.checkToken, m_employee.GetAll);
    server.get('/api/employee/:id', Middleware.checkToken, m_employee.GetDetail);
    server.post('/api/employee/', Middleware.checkToken, m_employee.Create);
    server.put('/api/employee/:id', Middleware.checkToken, m_employee.Update);
    server.del('/api/employee/:id', Middleware.checkToken, m_employee.Delete);

    server.get('/api/employee/new/', m_employee.GetNew);
    server.get('/api/employee/newedit/:id', m_employee.GetNewEdit);

    //Route Company
    server.get('/api/company/', m_company.GetAll);

    //Route validasi
    server.get('/api/validate/checkNumber/:employee_number', validasi.checkNumber);

    //Route Employee in User
    server.get('/api/validate/checkEmployee/:id', validasi.checkEmployee);

    //Route t_vent
    server.get('/api/event/', Middleware.checkToken, t_event.GetAll);

    server.get('/api/validate/checkusername/:username', validasi.checkUsername);
	
    //Route Unit
    server.get('/api/unit/',Middleware.checkToken, munit.GetAll);
};