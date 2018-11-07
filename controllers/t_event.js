'use strict';
const moment = require('moment');
const logger = require('../config/log');
const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const t_eventModel = require('../models/t_event.model.')

const now = new Date();

const EventController = {
    GetAll : (req, res, next) => {
        logger.info("Initializing Event - getAll" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        
        global.dbo.collection('t_event').find( {is_delete : false}).toArray((err, data) => {
            if(err){
                return next (new Error());
            }
            
            let model = data.map((entity) => {
                return new t_eventModel(entity);
            });

            Response.send(res, 200, model);
        });
    }
}
module.exports = EventController