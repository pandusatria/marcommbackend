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
                            request_date : { "$dateToString": { "format": "%d-%m-%Y", "date" : "$request_date"}}, 
                            approved_by : "$approved_by", 
                            approved_date : "$approved_date", 
                            assign_to : "$assign_to", 
                            closed_date : "$closed_date", 
                            note : "$note", 
                            status : "$status", 
                            reject_reason : "$reject_reason", 
                            is_delete : "$is_delete",
                            created_by : "$created_by",
                            created_date : { "$dateToString": { "format": "%d-%m-%Y", "date" : "$created_date"}},
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
        data.request_by     = ObjectID(global.user.m_employee_id); 
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
        console.log(model);
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
    },

    GetAllHandlerSearch : (req, res, next) =>{
        logger.info("Initialized Supplier : GetAllHandlerSearch" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let search = req.body;
        console.log("Request");
        console.log(search.filter);

        var myMatch = {};
        for (var i = 0; i < search.filter.length; i++) 
        {
            myMatch[search.filter[i].id] = search.filter[i].value;
        }

        console.log("My Match : ");
        console.log(myMatch);

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
                $project:
                {
                _id : 1,
                code : "$code", 
                event_name : "$event_name", 
                start_date :  { "$dateToString": { "format": "%d-%m-%Y", "date" : "$start_date"}}, 
                end_date :  { "$dateToString": { "format": "%d-%m-%Y", "date" : "$end_date"}}, 
                place : "$place", 
                budget : "$budget", 
                request_by : { $concat: [ "$employee_lookup.first_name", " ", "$employee_lookup.last_name" ] }, 
                request_date : { "$dateToString": { "format": "%d-%m-%Y", "date" : "$request_date"}}, 
                approved_by : { $concat: [ "$employee_lookup.first_name", " ", "$employee_lookup.last_name" ] }, 
                approved_date : "$approved_date", 
                assign_to : "$assign_to", 
                closed_date : "$closed_date", 
                note : "$note", 
                status : "$status", 
                reject_reason : "$reject_reason", 
                is_delete : "$is_delete",
                created_by : "$created_by",
                created_date : { "$dateToString": { "format": "%d-%m-%Y", "date" : "$created_date"}},
                updated_by : "$updated_by",
                updated_date : "$updated_date" 
                }
            },
            {
                $match: 
                { 
                    $and:
                    [
                        myMatch
                    ] 
                }
            },
            ]).toArray((err, data) => {
                if(err)
                {
                    logger.info("Event : GetAllHandlerSearch Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    logger.error(err);
                    return next(new Error());
                }
    
                logger.info("Event : GetAllHandlerSearch successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.info({data : data}, "Event : GetAllHandlerSearch content");
                Response.send(res, 200, data);
            });
    },

    UpdateByRequester : (req, res, next) => {
        logger.info("Initializing Event - Update" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        let reqdata = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('t_event').find( { is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err){
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new t_eventModel(entity);
            });

            updatemodel._id = ObjectID(id);
            
            console.log("Masuk");
            console.log(oldmodel);

            if(reqdata.code == null || reqdata.code == undefined || reqdata.code == "")
            {
                updatemodel.code = oldmodel[0].code;
            }else{
                updatemodel.code = reqdata.code;
            }

            if(reqdata.event_name == null || reqdata.event_name == undefined || reqdata.event_name == "")
            {
                updatemodel.event_name = oldmodel[0].event_name;
            }else{
                updatemodel.event_name = reqdata.event_name;
            }

            if(reqdata.start_date == null || reqdata.start_date == undefined || reqdata.start_date == "")
            {
                updatemodel.start_date = oldmodel[0].start_date;
            }else{
                updatemodel.start_date = reqdata.start_date;
            }

            if(reqdata.end_date == null || reqdata.end_date == undefined || reqdata.end_date == "")
            {
                updatemodel.end_date = oldmodel[0].end_date;
            }else{
                updatemodel.end_date = reqdata.end_date;
            }

            if(reqdata.place == null || reqdata.place == undefined || reqdata.place == "")
            {
                updatemodel.place = oldmodel[0].place;
            }else{
                updatemodel.place = reqdata.place;
            }

            if(reqdata.budget == null || reqdata.budget == undefined || reqdata.budget == "")
            {
                updatemodel.budget = oldmodel[0].budget;
            }else{
                updatemodel.budget = reqdata.budget;
            }

            if(reqdata.note == null || reqdata.note == undefined || reqdata.note == "")
            {
                updatemodel.note = oldmodel[0].note;
            }else{
                updatemodel.note = reqdata.note;
            }

            if(reqdata.status == null || reqdata.status == undefined || reqdata.status == "")
            {
                updatemodel.status = oldmodel[0].status;
            }else{
                updatemodel.status = reqdata.status;
            }

            updatemodel.request_by     = oldmodel[0].request_by; 
            updatemodel.request_date   = oldmodel[0].request_date; 
            updatemodel.approved_by    = oldmodel[0].approved_by; 
            updatemodel.approved_date  = oldmodel[0].approved_date; 
            updatemodel.assign_to      = oldmodel[0].assign_to; 
            updatemodel.closed_date    = oldmodel[0].closed_date; 
            updatemodel.reject_reason  = oldmodel[0].reject_reason; 
            updatemodel.is_delete      = oldmodel[0].is_delete; 
            updatemodel.created_by     = oldmodel[0].created_by; 
            updatemodel.created_date   = oldmodel[0].created_date; 
            updatemodel.updated_by     = global.user.employee; 
            updatemodel.updated_date   = now;

            var model = new t_eventModel(updatemodel);

            global.dbo.collection('t_event').findOneAndUpdate
            (
                { '_id' : ObjectID(id)},
                {$set : model},
                function(err, data){
                    if(err){
                        return next(new Error());
                    }

                    Response.send(res, 200, data)
                }
            );
        });
    },
    UpdateByAdmin : (req, res, next) => {
        logger.info("Initializing Event - Update" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        let reqdata = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('t_event').find( { is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err){
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new t_eventModel(entity);
            });

            updatemodel._id = ObjectID(id);
            
            console.log("Masuk");
            console.log(oldmodel);

            if(reqdata.status == null || reqdata.status == undefined || reqdata.status == "")
            {
                updatemodel.status = oldmodel[0].status;
            }else{
                updatemodel.status = reqdata.status;
            }
            updatemodel.code           = oldmodel[0].code;
            updatemodel.event_name     = oldmodel[0].event_name; 
            updatemodel.start_date     = oldmodel[0].start_date; 
            updatemodel.end_date       = oldmodel[0].end_date; 
            updatemodel.place          = oldmodel[0].place; 
            updatemodel.budget         = oldmodel[0].budget; 
            updatemodel.request_by     = oldmodel[0].request_by; 
            updatemodel.request_date   = oldmodel[0].request_date; 
            updatemodel.approved_by    = ObjectID(global.user.m_employee_id); 
            updatemodel.approved_date  = now; 
            updatemodel.assign_to      = ObjectID(reqdata.assign_to); 
            updatemodel.closed_date    = oldmodel[0].closed_date; 
            updatemodel.reject_reason  = oldmodel[0].reject_reason; 
            updatemodel.note           = oldmodel[0].note; 
            updatemodel.is_delete      = oldmodel[0].is_delete; 
            updatemodel.created_by     = oldmodel[0].created_by; 
            updatemodel.created_date   = oldmodel[0].created_date; 
            updatemodel.updated_by     = oldmodel[0].updated_by; 
            updatemodel.updated_date   = oldmodel[0].updated_date;

            var model = new t_eventModel(updatemodel);

            global.dbo.collection('t_event').findOneAndUpdate
            (
                { '_id' : ObjectID(id)},
                {$set : model},
                function(err, data){
                    if(err){
                        return next(new Error());
                    }

                    Response.send(res, 200, data)
                }
            );
        });
    },
}
module.exports = EventController