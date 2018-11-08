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
        
        global.dbo.collection('t_event').find({ is_delete : false }).toArray((err, data) => {
            if(err){
                return next (new Error());
            }
            
            let model = data.map((entity) => {
                return new t_eventModel(entity);
            });

            Response.send(res, 200, model);
        });
    },

    Create : (req, res, next) => {
        let reqdata = req.body;
        var data = {};

        data.code           = reqdata.code;
        data.event_name     = reqdata.event_name; 
        data.start_date     = reqdata.start_date; 
        data.end_date       = reqdata.end_date; 
        data.place          = reqdata.place; 
        data.budget         = reqdata.budget; 
        data.request_by     = global.user.employee; 
        data.request_date   = now; 
        data.approved_by    = null; 
        data.approved_date  = null; 
        data.assign_to      = null; 
        data.closed_date    = null; 
        data.note           = null; 
        data.status         = 1; 
        data.reject_reason  = null; 
        data.is_delete      = false; 
        data.created_by     = global.user.employee; 
        data.created_date   = now; 
        data.updated_by     = null; 
        data.updated_date   = null;

        var model = new t_eventModel(data);

        global.dbo.collection('t_event').insertOne(model, function (err, data) {
            if(err){
                logger.info("Employee - Create Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
                logger.error(err)
                return next(new Error());
            }
                logger.info("Employee - Create Successful" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
                logger.info( { data, data })
                Response.send(res, 200, data)
        });
    },
    
    GetAllHandlerSortByDescending : (req, res, next) =>{
        logger.info("Initialized Event : GetAllHandlerSortByDescending" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('t_event').find({ is_delete : false }).sort( { "_id" : -1} ).limit(1).toArray((err, data) => {
            if(err)
            {
                logger.info("Event : GetAllHandlerSortByDescending Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            logger.info("Event : GetAllHandlerSortByDescending successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            logger.info({data : data}, "Souvenir : GetAllHandlerSortByDescending content");
            Response.send(res, 200, data);
        })
    }
}
module.exports = EventController