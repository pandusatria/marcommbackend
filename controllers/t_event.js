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
        
        global.dbo.collection('t_event').aggregate([
			{

              $lookup:
              {
                from : "m_employee",
                localField : "request_by",
                foreignField : "_id",
                as : "employee_lookup"
              }
            },
            {
              $unwind : "$employee_lookup"
            },
            {
              $match: { "is_delete" : false }
            },
            {
              $project:
              {
                _id : 1,
                code : "$code",
             	event_name : "$event_name", 
    			start_date : "$start_date", 
    			end_date : "$end_date", 
    			place : "$place", 
    			budget : "$budget", 
    			request_by : { $concat: [ "$employee_lookup.first_name", " ", "$employee_lookup.last_name" ] }, 
    			request_date : "$request_date", 
    			approved_by : "$approved_by", 
    			approved_date : "$approved_date", 
    			assign_to : "$assign_to", 
    			closed_date : "$closed_date", 
    			note : "$note", 
   		 		status : "$status", 
    			reject_reason : "$reject_reason", 
                is_delete : "$is_delete",
                created_by : "$created_by",
                created_date : "$created_date",
                updated_by : "$updated_by",
                updated_date : "$updated_date" 
              }
            }	
            ]).toArray((err, data) => {
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