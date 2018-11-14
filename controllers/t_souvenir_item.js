'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;

const moment = require('moment');
const logger = require('../config/log');
const tsitemModel = require('../models/t_souvenir_item.model');
const tsouvenirModel = require('../models/t_souvenir.model');

var now = new Date();

const TSItemController = {
    GetAll : (req, res, next) => {
        logger.info("Initialized Transaction Request Souvenir : GetAll" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('t_souvenir').aggregate([
            {
               $lookup :
               {
                   from : "m_user",
                   localField : "request_by",
                   foreignField : "_id",
                   as : "Show_User"
               }
           },
           {
               $unwind : "$Show_User"
           },
           {
               $lookup :
               {
                   from : "m_employee",
                   localField : "Show_User.m_employee_id",
                   foreignField : "_id",
                   as : "Show_Employee"
               }
           },
           {
               $unwind : "$Show_Employee"
           },
           {
               $lookup:
               {
                   from: "t_event",
                   localField: "t_event_id",
                   foreignField: "_id",
                   as: "Show_Event"
               }
           },
           {
               $unwind : "$Show_Event"
           },
           {
               $lookup:
               {
                   from: "t_souvenir_item",
                   localField: "_id",
                   foreignField: "t_souvenir_id",
                   as: "Show_tsouvenir"
               }
           },
           {
               $match:
               {
                   "is_delete": false
               }
           },
           {
                 $project:
                 {
                     "_id" : "$_id",
                   "code" : "$code",
                   "type" : "$type",
                   "t_event_id" : "$Show_Event.code",
                   "request_by" : { $concat: [ "$Show_Employee.first_name", " ", "$Show_Employee.last_name" ] },
                   "request_date" : { "$dateToString": { "format": "%d-%m-%Y", "date": "$request_date" } },
                   "request_due_date" : { "$dateToString": { "format": "%d-%m-%Y", "date": "$request_due_date" } },
                   "approved_by" : "$approved_by",
                   "approved_date" : "$approved_date",
                   "received_by" : "$received_by",
                   "received_date" : "$received_date",
                   "settlement_by" : "$settlement_by",
                   "settlement_date" : "$settlement_date",
                   "settlement_approved_by" : "$settlement_approved_by",
                   "settlement_approved_date" : "$settlement_approved_date",
                   "status" : "$status",
                   "note" : "$note",
                   "reject_reason" : "$reject_reason",
                   "is_delete" : "$is_delete",
                   "created_by" : "$created_by",
                   "created_date" : { "$dateToString": { "format": "%d-%m-%Y", "date": "$created_date" } },
                   "detail_souvenir" : "$Show_tsouvenir"
               }
           }
       ]).toArray((error, data) => {
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            logger.info("Showing all Data Transaction Request Souvenir " + global.user.username + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 200, data);
        });
    },

    GetDetail : (req, res, next) => {
        logger.info("Initialized Transaction Request Souvenir  : GetDetail" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        let id = req.params.id;
        
        global.dbo.collection('t_souvenir_item').aggregate([
            {
                $match : 
                { 
                    is_delete : false,
                    _id : ObjectID(id)
                }
            },
            {
                $lookup : 
                {
                    from : "m_souvenir",
                    localField : "m_souvenir_id",
                    foreignField : "_id",
                    as : "Show_MSouvenir"
                }
            },
            {
                $unwind : "$Show_MSouvenir"  
            },
            {
                $lookup : 
                {
                    from : "t_souvenir",
                    localField : "t_souvenir_id",
                    foreignField : "_id",
                    as : "Show_TSouvenir"
                }
            },
            {
                $unwind : "$Show_TSouvenir"  
            },
            {
                $project:
                {
                    _id : "$_id", 
                    t_souvenir_id : "$Show_TSouvenir._id", 
                    m_souvenir_id : "$Show_MSouvenir._id",
                    qty : "$qty", 
                    qty_settlement : "$qty_settlement",
                    note : "$note",
                    is_delete : "$is_delete",
                    created_by : "$created_by",
                    created_date : "$created_date",
                    updated_by : "$updated_by",
                    updated_date : "$updated_date"    
                }
            }	
        ]).toArray((error, data) => {
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            logger.info("Showing Detail Data Transaction Request Souvenir " + global.user.username + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 200, data);
        });
    },

    Create : (req, res, next) => {
        logger.info("Initialized Transaction Request Souvenir : Create" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        
        let reqdata = req.body;
        var data = {};

        data.code = reqdata.code;
        data.type = null;
        data.t_event_id = ObjectID(reqdata.t_event_id);
        data.request_by = ObjectID(reqdata.request_by);
        data.request_date = now;
        data.request_due_date = new Date(reqdata.request_due_date);
        data.approved_by = null;
        data.approved_date = null;
        data.received_by = null;
        data.received_date = null;
        data.settlement_by = null;
        data.settlement_date = null;
        data.settlement_approved_by = null;
        data.settlement_approved_date = null;
        data.status = reqdata.status;
        data.note = reqdata.note;
        data.reject_reason = null;
        data.is_delete = false;
        data.created_by = global.user.role;
        data.created_date = now;
        data.updated_by = null;
        data.updated_date = null;

        var model = new tsouvenirModel(data);

        global.dbo.collection('t_souvenir').insertOne(model, function(err, data){
            if(err){
                logger.info("Transaction Souvenir : Create Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }
            logger.info("Transaction Souvenir : Create successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            logger.info({data : data}, "Transaction Item Souvenir : Create content");
            logger.info("Catch ID");
            logger.info(data.message._id);
            console.log(data.insertedId);
            logger.info("############################");
            Response.send(res, 200, data);
       
            var id = data.insertedId;
            var souvenir_request = req.body.souvenir_request;

            var ListSouvenirItem = [];

            console.log("List Souvenir Item Mapping");
            console.log(souvenir_request);

            for(var counter=0; counter < souvenir_request.length; counter++) {
                var modelInsert = {};

                modelInsert.t_souvenir_id   =   ObjectID(id);
                modelInsert.m_souvenir_id   =   ObjectID(souvenir_request[counter].m_souvenir_id);
                modelInsert.qty             =   souvenir_request[counter].qty;
                modelInsert.note            =   souvenir_request[counter].note;
                modelInsert.is_delete       =   false;
                modelInsert.created_date    =   now;
                modelInsert.created_date    =   global.user.role;
                modelInsert.updated_date    =   null;
                modelInsert.updated_by      =   null;

                var model = new tsitemModel(modelInsert);
                ListSouvenirItem.push(model);
            }

            console.log("List Model to Add in Database");
            console.log(ListSouvenirItem);

            global.dbo.collection('t_souvenir_item').insertMany(ListSouvenirItem, function(err, data){
                if(err) {
                    return next(new Error());
                }

                Response.send(res, 200, data);
            })
        });

    },

    Update : (req, res, next) => {       
        logger.info("Initialized Transaction Request Souvenir : Update" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        let reqdata = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('t_souvenir_item').find({ is_delete : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new tsouvenirModel(entity);
            });

            updatemodel._id = ObjectID(id);
            updatemodel.code = oldmodel[0].code;
            updatemodel.type = oldmodel[0].type;
            updatemodel.t_event_id = ObjectID(oldmodel[0].t_event_id);
            updatemodel.request_by = ObjectID(oldmodel[0].request_by);
            updatemodel.request_date = oldmodel[0].request_date;

            updatemodel.request_due_date = new Date(oldmodel[0].request_due_date);

            updatemodel.approved_by = oldmodel[0].approved_by;
            updatemodel.approved_date = oldmodel[0].approved_date;
            updatemodel.received_by = oldmodel[0].received_by;
            updatemodel.received_date = oldmodel[0].received_date;
            updatemodel.settlement_by = oldmodel[0].settlement_by;
            updatemodel.settlement_date = oldmodel[0].settlement_date;
            updatemodel.settlement_approved_by = oldmodel[0].settlement_approved_by;
            updatemodel.settlement_approved_date = oldmodel[0].settlement_approved_date;
            updatemodel.status = oldmodel[0].status;

            if(reqdata.note == null || reqdata.note == undefined || reqdata.note == "") {
                updatemodel.note = oldmodel[0].note;
            } else {
                updatemodel.note = reqdata.note;   
            }

            updatemodel.reject_reason = oldmodel[0].reject_reason;
            updatemodel.is_delete = false;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.updated_by = global.user.username;
            updatemodel.updated_date = now;
            
            var modelUpdate = new tsouvenirModel(updatemodel);

            var souvenir_request = req.body.souvenir_request;

            var ListSouvenirItem = [];

            console.log("List Souvenir Item Mapping");
            console.log(souvenir_request);

            global.dbo.collection('t_souvenir_item').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: modelUpdate},
                function(err, data){
                    if(err)
                    {
                        logger.error(err);
                        return next(new Error());
                    }

                    logger.info("User " + global.user.username + " Update Data Transaction Request Souvenir at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    Response.send(res, 200, data);
                }
            );
        });
    },

    Delete : (req, res, next) => {
        logger.info("Initialized Souvenir : Delete" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        var oldmodel = {};
        var deletemodel = {};

        global.dbo.collection('t_souvenir_item').find({ is_delete : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new tsitemModel(entity);
            });

            deletemodel._id            = ObjectID(id);
            deletemodel.t_souvenir_id  = ObjectID(oldmodel[0].t_souvenir_id);
            deletemodel.m_souvenir_id  = ObjectID(oldmodel[0].m_souvenir_id);
            deletemodel.qty            = oldmodel[0].qty;
            deletemodel.qty_settlement = oldmodel[0].qty_settlement;
            deletemodel.note           = oldmodel[0].note;
            deletemodel.is_delete      = true;
            deletemodel.created_by     = oldmodel[0].created_by;
            deletemodel.created_date   = oldmodel[0].created_date;
            deletemodel.updated_by     = global.user.username;
            deletemodel.updated_date   = now;

            var modelDelete = new tsitemModel(deletemodel);

            global.dbo.collection('t_souvenir_item').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: modelDelete},
                function(err, data){
                    if(err)
                    {
                        logger.error(err);
                        return next(new Error());
                    }

                    logger.info("User " + global.user.username + " Delete Data Transaction Request Souvenir at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    Response.send(res, 200, data);
                }
            );
        });
    },

    Search : (req, res, next) => {
        logger.info("Initialized Transaction Request Souvenir : Search" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let reqdata = req.body;

        let match = {};

        for(var i = 0; i < reqdata.filter.length; i++){
            match[reqdata.filter[i].id] = reqdata.filter[i].value;
        }

        console.log("debuggg");
        console.log(match);

        global.dbo.collection('t_souvenir').aggregate([
            {
                $lookup :
                {
                    from : "m_user",
                    localField : "request_by",
                    foreignField : "_id",
                    as : "Show_User"
                }
            },
            {
                $unwind : "$Show_User"
            },
            {
                $lookup :
                {
                    from : "m_employee",
                    localField : "Show_User.m_employee_id",
                    foreignField : "_id",
                    as : "Show_Employee"
                }
            },
            {
                $unwind : "$Show_Employee"
            },
            {
                $lookup:
                {
                    from: "t_event",
                    localField: "t_event_id",
                    foreignField: "_id",
                    as: "Show_Event"
                }
            },
            {
                $unwind : "$Show_Event"
            },
            {
                $lookup:
                {
                    from: "t_souvenir_item",
                    localField: "_id",
                    foreignField: "t_souvenir_id",
                    as: "Show_tsouvenir"
                }
            },
            {
                $project:
                {
                    "_id" : "$_id",
                  "code" : "$code",
                  "type" : "$type",
                  "t_event_id" : "$Show_Event.code",
                  "request_by" : { $concat: [ "$Show_Employee.first_name", " ", "$Show_Employee.last_name" ] },
                  "request_date" : { "$dateToString": { "format": "%d-%m-%Y", "date": "$request_date" } },
                  "request_due_date" : { "$dateToString": { "format": "%d-%m-%Y", "date": "$request_due_date" } },
                  "approved_by" : "$approved_by",
                  "approved_date" : "$approved_date",
                  "received_by" : "$received_by",
                  "received_date" : "$received_date",
                  "settlement_by" : "$settlement_by",
                  "settlement_date" : "$settlement_date",
                  "settlement_approved_by" : "$settlement_approved_by",
                  "settlement_approved_date" : "$settlement_approved_date",
                  "status" : "$status",
                  "note" : "$note",
                  "reject_reason" : "$reject_reason",
                  "is_delete" : "$is_delete",
                  "created_by" : "$created_by",
                  "created_date" : { "$dateToString": { "format": "%d-%m-%Y", "date": "$created_date" } },
                  "detail_souvenir" : "$Show_tsouvenir"
              }
            },
            {
                $match : 
                {
                    $and:
                    [
                        match
                    ]
                }
            }
        ]).toArray((error, data) => {
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            logger.info("Showing Data User using search to " + global.user.username + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 200, data);   
            console.log("try....")
            console.log(data);
        });

    },

    Approved : (req, res, next) => {
        logger.info("Initialized Transaction Souvenir  : Approved" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        let reqdata = req.body;
        var updatemodel = {};
        var oldmodel = {};


        console.log("Over here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(id);
        global.dbo.collection('t_souvenir').find({is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err) {
                logger.info("Transaction Item Souvenir : Update Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new tsouvenirModel(entity);
            });

            console.log("Old Model : ");
            console.log(oldmodel);

            updatemodel._id = ObjectID(id);

            updatemodel.code                       =   oldmodel[0].code;
            updatemodel.type                       =   oldmodel[0].type;
            updatemodel.t_event_id                 =   oldmodel[0].t_event_id;
            updatemodel.request_by                 =   oldmodel[0].request_by;
            updatemodel.request_date               =   oldmodel[0].request_date;
            updatemodel.request_due_date           =   oldmodel[0].request_due_date;
            updatemodel.approved_by                =   global.user.role;
            updatemodel.approved_date              =   now;

            updatemodel.received_by                =   oldmodel[0].received_by;
            updatemodel.received_date              =   oldmodel[0].received_date;
            updatemodel.settlement_by              =   oldmodel[0].settlement_by;
            updatemodel.settlement_date            =   oldmodel[0].settlement_date;
            updatemodel.settlement_approved_by     =   oldmodel[0].settlement_approved_by;
            updatemodel.settlement_approved_date   =   oldmodel[0].settlement_approved_date;
            updatemodel.status                     =   2;
            updatemodel.note                       =   oldmodel[0].note;
            updatemodel.reject_reason              =   oldmodel[0].reject_reason;

            updatemodel.is_delete = false;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.updated_by = global.user.role;
            updatemodel.updated_date = now;

            console.log("Update Model : ");
            console.log(updatemodel);
            
            var model = new tsouvenirModel(updatemodel);

            console.log("Model : ");
            console.log(model);

            global.dbo.collection('t_souvenir').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        logger.error(err);
                        return next(new Error());
                    }

                    logger.info("User " + global.user.username + " Update Data Approved Transaction Request Souvenir at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    Response.send(res, 200, data);
                }
            );
        });
    },

    Rejected : (req, res, next) => {
        logger.info("Initialized Transaction Souvenir  : Rejected" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        let reqdata = req.body;
        var updatemodel = {};
        var oldmodel = {};


        console.log("Over here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(id);
        global.dbo.collection('t_souvenir').find({is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err) {
                logger.info("Transaction Item Souvenir : Update Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new tsouvenirModel(entity);
            });

            console.log("Old Model : ");
            console.log(oldmodel);

            updatemodel._id = ObjectID(id);

            updatemodel.code                       =   oldmodel[0].code;
            updatemodel.type                       =   oldmodel[0].type;
            updatemodel.t_event_id                 =   oldmodel[0].t_event_id;
            updatemodel.request_by                 =   oldmodel[0].request_by;
            updatemodel.request_date               =   oldmodel[0].request_date;
            updatemodel.request_due_date           =   oldmodel[0].request_due_date;
            updatemodel.approved_by                =   oldmodel[0].approved_by;
            updatemodel.approved_date              =   oldmodel[0].approved_date;

            updatemodel.received_by                =   oldmodel[0].received_by;
            updatemodel.received_date              =   oldmodel[0].received_date;
            updatemodel.settlement_by              =   oldmodel[0].settlement_by;
            updatemodel.settlement_date            =   oldmodel[0].settlement_date;
            updatemodel.settlement_approved_by     =   oldmodel[0].settlement_approved_by;
            updatemodel.settlement_approved_date   =   oldmodel[0].settlement_approved_date;
            updatemodel.status                     =   0;
            // dont forget change this note
            updatemodel.note                       =   oldmodel[0].note;
            updatemodel.reject_reason              =   oldmodel[0].reject_reason;

            updatemodel.is_delete = false;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.updated_by = global.user.role;
            updatemodel.updated_date = now;

            console.log("Update Model : ");
            console.log(updatemodel);
            
            var model = new tsouvenirModel(updatemodel);

            console.log("Model : ");
            console.log(model);

            global.dbo.collection('t_souvenir').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        logger.error(err);
                        return next(new Error());
                    }

                    logger.info("User " + global.user.username + " Update Data Rejected Transaction Request Souvenir at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    Response.send(res, 200, data);
                }
            );
        });
    },

    Received : (req, res, next) => {
        logger.info("Initialized Transaction Souvenir  : Received" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        let reqdata = req.body;
        var updatemodel = {};
        var oldmodel = {};


        console.log("Over here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(id);
        global.dbo.collection('t_souvenir').find({is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err) {
                logger.info("Transaction Item Souvenir : Update Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new tsouvenirModel(entity);
            });

            console.log("Old Model : ");
            console.log(oldmodel);

            updatemodel._id = ObjectID(id);

            updatemodel.code                       =   oldmodel[0].code;
            updatemodel.type                       =   oldmodel[0].type;
            updatemodel.t_event_id                 =   oldmodel[0].t_event_id;
            updatemodel.request_by                 =   oldmodel[0].request_by;
            updatemodel.request_date               =   oldmodel[0].request_date;
            updatemodel.request_due_date           =   oldmodel[0].request_due_date;
            updatemodel.approved_by                =   oldmodel[0].approved_by;
            updatemodel.approved_date              =   oldmodel[0].approved_date;

            updatemodel.received_by                =   global.user.username;
            updatemodel.received_date              =   now;
            updatemodel.settlement_by              =   oldmodel[0].settlement_by;
            updatemodel.settlement_date            =   oldmodel[0].settlement_date;
            updatemodel.settlement_approved_by     =   oldmodel[0].settlement_approved_by;
            updatemodel.settlement_approved_date   =   oldmodel[0].settlement_approved_date;
            updatemodel.status                     =   3;
            // dont forget change this note
            updatemodel.note                       =   oldmodel[0].note;
            updatemodel.reject_reason              =   oldmodel[0].reject_reason;

            updatemodel.is_delete = false;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.updated_by = global.user.role;
            updatemodel.updated_date = now;

            console.log("Update Model : ");
            console.log(updatemodel);
            
            var model = new tsouvenirModel(updatemodel);

            console.log("Model : ");
            console.log(model);

            global.dbo.collection('t_souvenir').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        logger.error(err);
                        return next(new Error());
                    }

                    logger.info("User " + global.user.username + " Update Data Rejected Transaction Request Souvenir at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    Response.send(res, 200, data);
                }
            );
        });
    }
};
module.exports = TSItemController;
