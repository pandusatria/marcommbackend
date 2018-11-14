'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');
const logger = require('../config/log');
const tsouvenirModel = require('../models/t_souvenir.model');
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
                $unwind : "$employee_lkup"  
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
                $match : { is_delete : false}
            },
            {
                $project:
                {
                    "_id" : "$_id", 
                    "code" : "$code", 
                    "type" : "$type",
                    "t_event_id" : "$tevent_lkup._id",
                    "status_event" : "$tevent_lkup.status", 
                    
                    "received_by" : "$employee_lkup._id", 
                    "name_receiver" : { $concat: [ "$employee_lkup.first_name", " ", "$employee_lkup.last_name"] },
                    "received_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$received_date" } },
                    "note" : "$note",
                    
                    
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
                $match : { is_delete : false}
            },
            {
                $project:
                {
                    "_id" : "$_id", 
                    "code" : "$code", 
                    "type" : "$type",
                    "t_event_id" : "$t_event_id",
                    "status_event" : "$tevent_lkup.status", 
                    
                    "received_by" : "$received_by", 
                    "name_receiver" : { $concat: [ "$employee_lkup.first_name", " ", "$employee_lkup.last_name"] },
                    "received_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$received_date" } },
                    "note" : "$note",
                    
                    
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
                    "t_event_id" : "$t_event_id",
                    "status_event" : "$tevent_lkup.status", 
                    
                    "received_by" : "$received_by", 
                    "name_receiver" : { $concat: [ "$employee_lkup.first_name", " ", "$employee_lkup.last_name"] },
                    "received_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$received_date" } },
                    "note" : "$note",
                    
                    
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
    Create : (req, res, next) => {
        logger.info("Initialized Transaction Souvenir : Create" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        let reqdata = req.body;
        var data = {};

        data.code = reqdata.code;
        data.type = reqdata.type;
        data.t_event_id = ObjectID(reqdata.t_event_id);
        data.request_by = ObjectID(reqdata.request_by);
        data.request_date = null;
        data.request_date = null;
        data.approved_by = ObjectID(reqdata.approved_by);
        data.approved_date = null;
        data.received_by = ObjectID(reqdata.received_by);
        data.received_date = null;
        data.settlement_by = ObjectID(reqdata.settlement_by);
        data.settlement_date = null;
        data.settlement_approved_by = ObjectID(reqdata.settlement_approved_by);
        data.settlement_approved_date = null;
        data.status = reqdata.status;
        data.note = reqdata.note;
        data.reject_reason = reqdata.reject_reason;
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
            Response.send(res, 200, data);
        });
    },
    GetSouvenirItem : (req, res, next) => {
        logger.info("Initialized Souvenir : GetSouvenirItem" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        let id = req.params.id;

        global.dbo.collection('t_souvenir').aggregate([
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
                    "type" : "$type",
                    "t_event_id" : "$t_event_id",
                    "status_event" : "$tevent_lkup.status", 
                    
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
    CreateTSouvenir : (req, res, next) => {
        let id = req.params.id;
        let reqdata = req.body;
        var data = {};
        var ListSouvenir = [];
        var oldmodel = {};

        console.log("ID Souvenir : ");
        console.log(id);

        ListSouvenir = reqdata.DetailSouvenir;

        console.log("List Souvenir : ");
        console.log(ListSouvenir);

        global.dbo.collection('t_souvenir').find({is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new tsouvenirModel(entity);
            });

            console.log("Old Model : ");
            console.log(oldmodel);

            data._id = ObjectID(id);

            data.code = reqdata.code;
            data.type = reqdata.type;
            data.t_event_id = ObjectID(reqdata.t_event_id);
            data.request_by = ObjectID(reqdata.request_by);
            data.request_date = null;
            data.request_date = null;
            data.approved_by = ObjectID(reqdata.approved_by);
            data.approved_date = null;
            data.received_by = ObjectID(reqdata.received_by);
            data.received_date = null;
            data.settlement_by = ObjectID(reqdata.settlement_by);
            data.settlement_date = null;
            data.settlement_approved_by = ObjectID(reqdata.settlement_approved_by);
            data.settlement_approved_date = null;
            data.status = reqdata.status;
            data.note = reqdata.note;
            data.reject_reason = reqdata.reject_reason;
            data.is_delete = false;
            data.created_by = global.user.role;
            data.created_date = now;
            data.updated_by = null;
            data.updated_date = null;

            console.log("Create Model : ");
            console.log(data);

            var model = new tsouvenirModel(data);

            console.log("Model : ");
            console.log(model);

            // First Create Souvenir Stock
            console.log("First : Create Souvenir Stock");
            global.dbo.collection('t_souvenir').insertOne
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        return next(new Error());
                    }

                    // Second Delete Detail Souvenir By Souvenir Item
                    console.log("Second : Delete Detail Souvenir By Souvenir Item");
                    global.dbo.collection('t_souvenir_item').deleteMany
                    (
                        {'t_souvenir' : ObjectID(id)},
                        function(err, data){
                            if(err)
                            {
                                return next(new Error());
                            }

                            // Third Insert All Souvenir from List Souvenir
                            var ListSouvenirModel = [];

                            console.log("List Souvenir to Mapping");
                            console.log(ListSouvenir);

                            for (var counter=0; counter < ListSouvenir.length; counter++){
                                    var modelInsert = {};

                                    modelInsert.name            =   ListSouvenir[counter].name;
                                    modelInsert.t_souvenir_id   =   ObjectID(id);
                                    modelInsert.qty             =   ListSouvenir[counter].qty;
                                    modelInsert.note            =   ListSouvenir[counter].note;

                                    modelInsert.is_delete       =   false;
                                    modelInsert.created_date    =   now;
                                    modelInsert.created_date    =   global.user.role;
                                    modelInsert.updated_date    =   null;
                                    modelInsert.updated_by      =   null;

                                    var model = new tsitemModel(modelInsert);
                                    ListSouvenirModel.push(model);
                            }

                            console.log("List Model to Add in Database");
                            console.log(ListSouvenirModel);

                            global.dbo.collection('t_souvenir_item').insertMany(ListSouvenirModel, function(err, data){
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
    // Update : (req, res, next) => {
    //     logger.info("Initialized Transaction Item Souvenir : Update" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

    //     let id = req.params.id;
    //     let reqdata = req.body;
    //     var oldmodel = {};
    //     var updatemodel = {};

    //     global.dbo.collection('t_souvenir_item').find({is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
    //         if(err)
    //         {
    //             logger.info("Transaction Item Souvenir : Update Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //             logger.error(err);
    //             return next(new Error());
    //         }

    //         oldmodel = data.map((entity) => {
    //             return new tsitemModel(entity);
    //         });

    //         updatemodel._id = ObjectID(id);

    //         if(reqdata.t_souvenir_id == null || reqdata.t_souvenir_id == undefined || reqdata.t_souvenir_id == "")
    //         {
    //             updatemodel.t_souvenir_id = oldmodel[0].t_souvenir_id;
    //         }
    //         else
    //         {
    //             updatemodel.t_souvenir_id = ObjectID(reqdata.t_souvenir_id); 
    //         }

    //         if(reqdata.m_souvenir_id == null || reqdata.m_souvenir_id == undefined || reqdata.m_souvenir_id == "")
    //         {
    //             updatemodel.m_souvenir_id = oldmodel[0].m_souvenir_id;
    //         }
    //         else
    //         {
    //             updatemodel.m_souvenir_id = ObjectID(reqdata.m_souvenir_id);   
    //         }

    //         if(reqdata.qty == null || reqdata.qty == undefined || reqdata.qty == "")
    //         {
    //             updatemodel.qty = oldmodel[0].qty;
    //         }
    //         else
    //         {
    //             updatemodel.qty = reqdata.qty;   
    //         }

    //         if(reqdata.qty_settlement == null || reqdata.qty_settlement == undefined || reqdata.qty_settlement == "")
    //         {
    //             updatemodel.qty_settlement = oldmodel[0].qty_settlement;
    //         }
    //         else
    //         {
    //             updatemodel.qty_settlement = reqdata.qty_settlement;   
    //         }

    //         if(reqdata.note == null || reqdata.note == undefined || reqdata.note == "")
    //         {
    //             updatemodel.note = oldmodel[0].note;
    //         }
    //         else
    //         {
    //             updatemodel.note = reqdata.note;   
    //         }

    //         updatemodel.is_delete = false;
    //         updatemodel.created_by = oldmodel[0].created_by;
    //         updatemodel.created_date = oldmodel[0].created_date;
    //         updatemodel.updated_by = oldmodel[0].updated_by;
    //         updatemodel.updated_date = now;
            
    //         var model = new tsitemModel(updatemodel);

    //         global.dbo.collection('t_souvenir_item').findOneAndUpdate
    //         (
    //             {'_id' : ObjectID(id)},
    //             {$set: model},
    //             function(err, data){
    //                 if(err)
    //                 {
    //                     logger.info("Transaction Item Souvenir : Update Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //                     logger.error(err);
    //                     return next(new Error());
    //                 }
    //                 logger.info("Transaction Item Souvenir : Update successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //                 logger.info({data : data}, "Transaction Item Souvenir : Update content");
    //                 Response.send(res, 200, data);
    //             }
    //         );
    //     });
    // },
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
};
module.exports = TSController;