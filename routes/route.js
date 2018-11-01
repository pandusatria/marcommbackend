'use strict';

const Middleware = require('../middleware/tokenauthorization');
const corsMiddleware = require('restify-cors-middleware');
const moment = require('moment');
const logger = require('../config/log');

const msouvenir = require('../controllers/m_souvenir');
const tsitem = require('../controllers/t_souvenir_item');

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

    //Route m_souvenir
    server.get('/api/souvenir/', msouvenir.GetAll);
    server.get('/api/souvenir/:id', msouvenir.GetDetail);
    server.post('/api/souvenir/', msouvenir.Create);
    server.put('/api/souvenir/:id', msouvenir.Update);
    server.del('/api/souvenir/:id', msouvenir.Delete);

    //Route t_souvenir_item
    server.get('/api/tsitem/', tsitem.GetAll);
    server.get('/api/tsitem/:id', tsitem.GetDetail);
    server.post('/api/tsitem/', tsitem.Create);
};