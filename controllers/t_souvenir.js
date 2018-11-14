'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');
const logger = require('../config/log');
const tsouvenirModel = require('../models/t_souvenir.model');
const tsitemModel = require('../models/t_souvenir_item.model');
var now = new Date();

const TSController = {
    GetAll : (req, res, next) => {
        logger.info("Initialized Transaction Item Souvenir : GetAll" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('t_souvenir').aggregate([
            {
                $lookup : {
                from : "m_employee",
                localField : "received_by",
                foreignField : "_id",
                as : "employee_lkup"
                }
            },
            {
                $lookup : {
                from : "t_event",
                localField : "t_event_id",
                foreignField : "_id",
                as : "tevent_lkup"
                }
            },
            {
                $unwind :
                {
                	path: "$tevent_lkup",
                	preserveNullAndEmptyArrays: true
                } 
            },
            {
                $unwind : 
                {
                	path: "$employee_lkup",
                	preserveNullAndEmptyArrays: true
                }
                 
            },
            {
                $lookup:
                {
                    from: 't_souvenir_item',
                    localField: '_id',
                    foreignField: 't_souvenir_id',
                    as: 'souvenir'
                }
            },
            {
                $match : 
                { 
                  is_delete : false,
                }
            },
            {
                $project:
                {
                    "_id" : "$_id", 
                    "code" : "$code", 
                    "type" : "$type",
                    "t_event_id" : { $ifNull: ["$tevent_lkup.t_event_id", "Null"] },
                    "request_by" : "$request_by", 
                    "request_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$request_date" } }, 
                    "request_due_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$request_due_date" } }, 
                    "approved_by" : "$approved_by",
                    "approved_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$approved_date" } },
                    "received_by" : { $ifNull: ["$employee_lkup._id", "Null"] }, 
                    "name_receiver" : { $concat: [ "$employee_lkup.first_name", " ", "$employee_lkup.last_name"] },
                    "received_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$received_date" } },
                    "settlement_by" : "$settlement_by",
                    "settlement_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$settlement_date" } },
                    "settlement_approved_by" : "$settlement_approved_by",
                    "settlement_approved_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$settlement_approved_date" } },
                    "status" : "$status",
                    "note" : "$note",
                    "reject_reason" : "$reject_reason",
                    
                    
                    "is_delete" : "$is_delete",
                    "created_by" : "$created_by",
                    "created_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$created_date" } },
                    "updated_by" : "$updated_by",
                    "updated_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$updated_date" } },
                    "DetailSouvenir" : "$souvenir"    
                }
            }	
        ]).toArray((err, data) => {
            if(err)
            {
                logger.info("Transaction Item Souvenir  : GetAll Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            logger.info("Transaction Item Souvenir  : GetAll successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            logger.info({data : data}, "Transaction Item Souvenir  : GetAll content");
            Response.send(res, 200, data);
        });
    },
    GetDetail : (req, res, next) => {
        logger.info("Initialized Transaction Souvenir  : GetDetail" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        
        global.dbo.collection('t_souvenir').aggregate([
            {
                $lookup : {
                from : "m_employee",
                localField : "received_by",
                foreignField : "_id",
                as : "employee_lkup"
                }
            },
            {
                $unwind : "$employee_lkup"  
            },
            {
                $match : { is_delete : false}
            },
            {
                $lookup : {
                from : "t_event",
                localField : "t_event_id",
                foreignField : "_id",
                as : "tevent_lkup"
                }
            },
            {
                $unwind : "$tevent_lkup"  
            },
            {
                $project:
                {
                    "_id" : "$_id", 
                    "code" : "$code", 
                    "type" : "$type",
                    "t_event_id" : "$tevent_lkup._id",
                    "request_by" : "$request_by", 
                    "request_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$request_date" } }, 
                    "request_due_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$request_due_date" } }, 
                    "approved_by" : "$approved_by",
                    "approved_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$approved_date" } },
                    "received_by" : "$employee_lkup._id", 
                    "name_receiver" : { $concat: [ "$employee_lkup.first_name", " ", "$employee_lkup.last_name"] },
                    "received_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$received_date" } },
                    "settlement_by" : "$settlement_by",
                    "settlement_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$settlement_date" } },
                    "settlement_approved_by" : "settlement_approved_by",
                    "settlement_approved_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$settlement_approved_date" } },
                    "status" : "$status",
                    "note" : "$note",
                    "reject_reason" : "$reject_reason",
                    
                    
                    "is_delete" : "$is_delete",
                    "created_by" : "$created_by",
                    "created_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$created_date" } },
                    "updated_by" : "$updated_by",
                    "updated_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$updated_date" } }   
                }
            }	
        ]).toArray((err, data) => {
            if(err)
            {
                logger.info("Transaction Item Souvenir  : GetDetail Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            logger.info("Transaction Item Souvenir  : GetDetail successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            logger.info({data : data}, "Transaction Item Souvenir  : GetDetail content");
            Response.send(res, 200, data);
        });
    },
    Create : (req, res, next) => {
        logger.info("Initialized Transaction Souvenir : Create" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        
        let reqdata = req.body;
        var data = {};

        data.code = reqdata.code;
        data.type = "";
        data.t_event_id = null;
        data.request_by = null;
        data.request_date = null;
        data.request_due_date = null;
        data.approved_by = null;
        data.approved_date = null;
        data.received_by = ObjectID(reqdata.received_by);
        data.received_date = new Date(reqdata.received_date);
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
            if(err)
            {
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
            var souvenir_stock = req.body.souvenir_stock;

            var ListSouvenirItem = [];

            console.log("List Souvenir Item Mapping");
            console.log(souvenir_stock);

            for(var counter=0; counter < souvenir_stock.length; counter++) {
                var modelInsert = {};

                modelInsert.t_souvenir_id   =   ObjectID(id);
                modelInsert.m_souvenir_id   =   ObjectID(souvenir_stock[counter].m_souvenir_id);
                modelInsert.qty             =   souvenir_stock[counter].qty;
                modelInsert.note            =   souvenir_stock[counter].note;
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
    // GetListSouvenirName : (req, res, next) => {
    //     logger.info("Initialized Supplier : GetListContactTitleName" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

    //     global.dbo.collection('m_souvenir').aggregate([]).toArray((err, data) => {
    //         if(err)
    //         {
    //             logger.info("Souvenir : GetListSouvenirName Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //             logger.error(err);
    //             return next(new Error());
    //         }

    //         logger.info("Souvenir : GetListSouvenirName successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //         logger.info({data : data}, "Souvenir : GetListSouvenirName content");
    //         Response.send(res, 200, data);
    //     });
    // },
    GetSouvenirItem : (req, res, next) => {
        logger.info("Initialized Souvenir : GetSouvenirItem" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        let id = req.params.id;

        global.dbo.collection('t_souvenir').aggregate([
            {
                $lookup : {
                from : "m_employee",
                localField : "received_by",
                foreignField : "_id",
                as : "employee_lkup"
                }
            },
            {
                $unwind : "$employee_lkup"  
            },
            {
                $lookup:
                {
                    from: 't_souvenir_item',
                    localField: '_id',
                    foreignField: 't_souvenir_id',
                    as: 'souvenir'
                }
            },

            {
                $match:
                {
                    "is_delete": false,
                    "_id" : ObjectID(id)
                }
            },
            {
                  $project:
                  {
                    "_id" : "$_id", 
                    "code" : "$code", 
                    // "type" : "$type",
                    // "t_event_id" : "$t_event_id",
                    // "status_event" : "$tevent_lkup.status", 
                    
                    "received_by" : "$received_by", 
                    "name_receiver" : { $concat: [ "$employee_lkup.first_name", " ", "$employee_lkup.last_name"] },
                    "received_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$received_date" } },
                    "note" : "$note",
                    
                    
                    "is_delete" : "$is_delete",
                    "created_by" : "$created_by",
                    "created_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$created_date" } },
                    "updated_by" : "$updated_by",
                    "updated_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$updated_date" } },
                    "DetailSouvenir" : "$souvenir"
                }
            }
        ]).toArray((err, data) => {
            if(err)
            {
                logger.info("Souvenir : GetSouvenirItem Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            logger.info("Souvenir : GetSouvenirItem successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            logger.info({data : data}, "Souvenir : GetSouvenirItem content");
            Response.send(res, 200, data);
        });
    },
    Update : (req, res, next) => {
        logger.info("Initialized Transaction Item Souvenir : Update" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        let reqdata = req.body;
        var updatemodel = {};
        var ListSouvenir = [];
        var oldmodel = {};

        console.log("ID TSouvenir : ");
        console.log(id);

        ListSouvenir = reqdata.DetailSouvenir;

        console.log("List Souvenir : ");
        console.log(ListSouvenir);

        global.dbo.collection('t_souvenir').find({is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                logger.info("Transaction Item Souvenir : Update Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new tsitemModel(entity);
            });

            console.log("Old Model : ");
            console.log(oldmodel);

            updatemodel._id = ObjectID(id);

            if(reqdata.code == null || reqdata.code == undefined || reqdata.code == "")
            {
                updatemodel.code = oldmodel[0].code;
            }
            else
            {
                updatemodel.code = reqdata.code; 
            }

            if(reqdata.type == null || reqdata.type == undefined || reqdata.type == "")
            {
                updatemodel.type = oldmodel[0].type;
            }
            else
            {
                updatemodel.type = reqdata.type;   
            }

            if(reqdata.t_event_id == null || reqdata.t_event_id == undefined || reqdata.t_event_id == "")
            {
                updatemodel.t_event_id = oldmodel[0].t_event_id;
            }
            else
            {
                updatemodel.t_event_id = ObjectID(reqdata.t_event_id);   
            }

            if(reqdata.request_by == null || reqdata.request_by == undefined || reqdata.request_by == "")
            {
                updatemodel.request_by = oldmodel[0].request_by;
            }
            else
            {
                updatemodel.request_by = ObjectID(reqdata.request_by);   
            }

            if(reqdata.request_date == null || reqdata.request_date == undefined || reqdata.request_date == "")
            {
                updatemodel.request_date = oldmodel[0].request_date;
            }
            else
            {
                updatemodel.request_date = reqdata.request_date;   
            }

            if(reqdata.request_due_date == null || reqdata.request_due_date == undefined || reqdata.request_due_date == "")
            {
                updatemodel.request_due_date = oldmodel[0].request_due_date;
            }
            else
            {
                updatemodel.request_due_date = reqdata.request_due_date;   
            }

            if(reqdata.approved_by == null || reqdata.approved_by == undefined || reqdata.approved_by == "")
            {
                updatemodel.approved_by = oldmodel[0].approved_by;
            }
            else
            {
                updatemodel.approved_by = ObjectID(reqdata.approved_by);   
            }

            if(reqdata.approved_date == null || reqdata.approved_date == undefined || reqdata.approved_date == "")
            {
                updatemodel.approved_date = oldmodel[0].approved_date;
            }
            else
            {
                updatemodel.approved_date = reqdata.approved_date;   
            }

            if(reqdata.received_by == null || reqdata.received_by == undefined || reqdata.received_by == "")
            {
                updatemodel.received_by = oldmodel[0].received_by;
            }
            else
            {
                updatemodel.received_by = ObjectID(reqdata.received_by);   
            }

            if(reqdata.received_date == null || reqdata.received_date == undefined || reqdata.received_date == "")
            {
                updatemodel.received_date = oldmodel[0].received_date;
            }
            else
            {
                updatemodel.received_date = reqdata.received_date;   
            }

            if(reqdata.settlement_by == null || reqdata.settlement_by == undefined || reqdata.settlement_by == "")
            {
                updatemodel.settlement_by = oldmodel[0].settlement_by;
            }
            else
            {
                updatemodel.settlement_by = ObjectID(reqdata.settlement_by);   
            }

            if(reqdata.settlement_date == null || reqdata.settlement_date == undefined || reqdata.settlement_date == "")
            {
                updatemodel.settlement_date = oldmodel[0].settlement_date;
            }
            else
            {
                updatemodel.settlement_date = reqdata.settlement_date;   
            }

            if(reqdata.settlement_approved_by == null || reqdata.settlement_approved_by == undefined || reqdata.settlement_approved_by == "")
            {
                updatemodel.settlement_approved_by = oldmodel[0].settlement_approved_by;
            }
            else
            {
                updatemodel.settlement_approved_by = ObjectID(reqdata.settlement_approved_by);   
            }

            if(reqdata.settlement_approved_date == null || reqdata.settlement_approved_date == undefined || reqdata.settlement_approved_date == "")
            {
                updatemodel.settlement_approved_date = oldmodel[0].settlement_approved_date;
            }
            else
            {
                updatemodel.settlement_approved_date = reqdata.settlement_approved_date;   
            }

            if(reqdata.status == null || reqdata.status == undefined || reqdata.status == "")
            {
                updatemodel.status = oldmodel[0].status;
            }
            else
            {
                updatemodel.status = reqdata.status;   
            }

            if(reqdata.note == null || reqdata.note == undefined || reqdata.note == "")
            {
                updatemodel.note = oldmodel[0].note;
            }
            else
            {
                updatemodel.note = reqdata.note;   
            }

            if(reqdata.reject_reason == null || reqdata.reject_reason == undefined || reqdata.reject_reason == "")
            {
                updatemodel.reject_reason = oldmodel[0].reject_reason;
            }
            else
            {
                updatemodel.reject_reason = reqdata.reject_reason;   
            }

            updatemodel.is_delete = false;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.updated_by = global.user.role;
            updatemodel.updated_date = now;

            console.log("Update Model : ");
            console.log(updatemodel);
            
            var model = new tsitemModel(updatemodel);

            console.log("Model : ");
            console.log(model);

            // First Update Souvenir Stock
            console.log("First : Update Souvenir Stock");
            global.dbo.collection('t_souvenir').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        logger.info("Transaction Item Souvenir : Update Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                        logger.error(err);
                        return next(new Error());
                    }

                    // Second Delete Detail Souvenir Stock
                    console.log("Second : Delete Detail Souvenir Stock");
                    global.dbo.collection('t_souvenir_item').deleteMany
                    (
                        {'t_souvenir_id' : ObjectID(id)},
                        function(err, data){
                            if(err)
                            {
                                logger.info("Transaction Souvenir : Create Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                                logger.error(err);
                                return next(new Error());
                            }
                            // logger.info("Transaction Souvenir : Create successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                            // logger.info({data : data}, "Transaction Item Souvenir : Create content");
                            // logger.info("Catch ID");
                            // logger.info(data.message._id);
                            // console.log(data.insertedId);
                            // logger.info("############################");

                            // Third Insert All Product from T.Souvenir Item
                            
                            // var id = updatemodel.insertedId;
                            // var souvenir_stock = req.body.souvenir_stock;

                            var ListSouvenirItem = [];

                            console.log("List Souvenir Item to Mapping");
                            console.log(ListSouvenir);

                            for (var counter=0; counter < ListSouvenir.length; counter++){
                                    var modelInsert = {};

                                    modelInsert.t_souvenir_id   =   ObjectID(id);
                                    modelInsert.m_souvenir_id   =   ObjectID(ListSouvenir[counter].m_souvenir_id);
                                    modelInsert.qty             =   ListSouvenir[counter].qty;
                                    modelInsert.note            =   ListSouvenir[counter].note;
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
                                if(err)
                                {
                                    return next(new Error());
                                }

                                Response.send(res, 200, data);
                            });
                        }
                    );
                }
            );
        });
    },
    // Delete : (req, res, next) => {
    //     logger.info("Initialized Transaction Souvenir : Delete" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

    //     let id = req.params.id;
    //     var oldmodel = {};
    //     var deletemodel = {};

    //     global.dbo.collection('t_souvenir').find({is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
    //         if(err)
    //         {
    //             logger.info("Transaction Souvenir : Delete Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //             logger.error(err);
    //             return next(new Error());
    //         }

    //         oldmodel = data.map((entity) => {
    //             return new tsouvenirModel(entity);
    //         });

    //         deletemodel._id = ObjectID(id);
    //         deletemodel.code = oldmodel[0].code;
    //         deletemodel.type = oldmodel[0].type;
    //         deletemodel.t_event_id = oldmodel[0].t_event_id;
    //         deletemodel.request_by = oldmodel[0].request_by;
    //         deletemodel.request_date = oldmodel[0].request_date;

    //         deletemodel.request_due_date = oldmodel[0].request_due_date;
    //         deletemodel.approved_by = oldmodel[0].approved_by;
    //         deletemodel.approved_date = oldmodel[0].approved_date;
    //         deletemodel.received_by = oldmodel[0].received_by;
    //         deletemodel.received_date = oldmodel[0].received_date;

    //         deletemodel.settlement_by = oldmodel[0].settlement_by;
    //         deletemodel.settlement_date = oldmodel[0].settlement_date;
    //         deletemodel.settlement_approved_by = oldmodel[0].settlement_approved_by;
    //         deletemodel.settlement_approved_date = oldmodel[0].settlement_approved_date;
    //         deletemodel.status = oldmodel[0].status;
    //         deletemodel.note = oldmodel[0].note;
    //         deletemodel.reject_reason = oldmodel[0].reject_reason;

    //         deletemodel.is_delete = true;
    //         deletemodel.created_by = oldmodel[0].created_by;
    //         deletemodel.created_date = oldmodel[0].created_date;
    //         deletemodel.updated_by = oldmodel[0].updated_by;
    //         deletemodel.updated_date = now;

    //         var model = new tsitemModel(deletemodel);

    //         global.dbo.collection('t_souvenir').findOneAndUpdate
    //         (
    //             {'_id' : ObjectID(id)},
    //             {$set: model},
    //             function(err, data){
    //                 if(err)
    //                 {
    //                     logger.info("Transaction Souvenir : Delete Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //                     logger.error(err);
    //                     return next(new Error());
    //                 }
    //                 logger.info("Transaction Souvenir : Delete successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //                 logger.info({data : data}, "Transaction Souvenir : Delete content");
    //                 Response.send(res, 200, data);
    //             }
    //         );
    //     });
    // }
    GetAllHandlerSearch : (req, res, next) => {
        logger.info("Initialized Souvenir : GetAllHandlerSearch" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

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


        global.dbo.collection('t_souvenir').aggregate([
            {
                $lookup : {
                from : "m_employee",
                localField : "received_by",
                foreignField : "_id",
                as : "employee_lkup"
                }
            },
            {
                $unwind : "$employee_lkup"  
            },
            {
                $project:
                {
                    "_id" : "$_id", 
                    "code" : "$code", 
                    "received_by" : "$employee_lkup._id", 
                    "name_receiver" : { $concat: [ "$employee_lkup.first_name", " ", "$employee_lkup.last_name"] },
                    "received_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$received_date" } },
                    
                    "is_delete" : "$is_delete",
                    "created_by" : "$created_by",
                    "created_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$created_date" } },
                    "updated_by" : "$updated_by",
                    "updated_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$updated_date" } }    
                }
            },	
            {
                $match: {
                    $and:
                    [
                        myMatch
                    ]
                }
            }
        ]).toArray((err, data) => {
            if(err)
            {
                logger.info("Souvenir : GetAllHandlerSearch Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            logger.info("Souvenir : GetAllHandlerSearch successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            logger.info({data : data}, "Souvenir : GetAllHandlerSearch content");
            Response.send(res, 200, data);
        });
    },
    GetAllHandlerSortByDescending : (req, res, next) => {
        logger.info("Initialized Supplier : GetAllHandlerSortByDescending" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('t_souvenir').aggregate([
            {
                $match : { is_delete : false}
            },
            {
              $sort:{"_id":-1}
            },
            { 
              $limit : 1 
            },
        ]).toArray((err, data) => {
            if(err)
            {
                logger.info("Souvenir : GetAllHandlerSortByDescending Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            logger.info("Souvenir : GetAllHandlerSortByDescending successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            logger.info({data : data}, "Souvenir : GetAllHandlerSortByDescending content");
            Response.send(res, 200, data);
        });
    },
    
   
};
module.exports = TSController;