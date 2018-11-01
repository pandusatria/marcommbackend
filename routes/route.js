'use strict';

const Middleware = require('../middleware/tokenauthorization');
const corsMiddleware = require('restify-cors-middleware');
const moment = require('moment');
const logger = require('../config/log');
var m_employee = require('../controllers/m_employee');
var m_company = require('../controllers/m_company');

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
    // Route Employee
    server.get('/api/employee/', m_employee.GetAll);
    server.get('/api/employee/:id', m_employee.GetDetail);
    server.post('/api/employee/', m_employee.Create);
    server.put('/api/employee/:id', m_employee.Update);
    server.del('/api/employee/:id', m_employee.Delete);

    //Route Company
    server.get('/api/company/', m_company.GetAll);



};