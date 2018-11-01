'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');
const logger = require('../config/log');
const tsitemModel = require('../models/t_souvenir_item.model');
var now = new Date();

const TSItemController = {
    GetAll : (req, res, next) => {
        logger.info("Initialized Transaction Item Souvenir : GetAll" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('t_souvenir_item').aggregate([
            {
                $lookup : {
                from : "m_souvenir",
                localField : "m_souvenir_id",
                foreignField : "_id",
                as : "msouvenir_lkup"
                }
            },
            {
                $unwind : "$msouvenir_lkup"  
            },
            {
                $lookup : {
                from : "t_souvenir",
                localField : "t_souvenir_id",
                foreignField : "_id",
                as : "tsouvenir_lkup"
                }
            },
            {
                $unwind : "$tsouvenir_lkup"  
            },
            {
                $match : { is_delete : false}
            },
            {
                $project:
                {
                    "_id" : "$_id", 
                    "t_souvenir_id" : "$tsouvenir_lkup._id", 
                    "m_souvenir_id" : "$msouvenir_lkup._id",
                    "qty" : "$qty", 
                    "qty_settlement" : "$qty_settlement",
                    "note" : "$note",
                    "is_delete" : "$is_delete",
                    "created_by" : "$created_by",
                    "created_date" : "$created_date",
                    "updated_by" : "$updated_by",
                    "updated_date" : "$updated_date"    
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
        logger.info("Initialized Transaction Item Souvenir  : GetDetail" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        let id = req.params.id;
        
        global.dbo.collection('t_souvenir_item').aggregate([
            {
                $lookup : {
                from : "m_souvenir",
                localField : "m_souvenir_id",
                foreignField : "_id",
                as : "msouvenir_lkup"
                }
            },
            {
                $unwind : "$msouvenir_lkup"  
            },
            {
                $lookup : {
                from : "t_souvenir",
                localField : "t_souvenir_id",
                foreignField : "_id",
                as : "tsouvenir_lkup"
                }
            },
            {
                $unwind : "$tsouvenir_lkup"  
            },
            {
                $match : { is_delete : false}
            },
            {
                $project:
                {
                    "_id" : "$_id", 
                    "t_souvenir_id" : "$tsouvenir_lkup._id", 
                    "m_souvenir_id" : "$msouvenir_lkup._id",
                    "qty" : "$qty", 
                    "qty_settlement" : "$qty_settlement",
                    "note" : "$note",
                    "is_delete" : "$is_delete",
                    "created_by" : "$created_by",
                    "created_date" : "$created_date",
                    "updated_by" : "$updated_by",
                    "updated_date" : "$updated_date"    
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
        logger.info("Initialized Transaction Item Souvenir : Create" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        let reqdata = req.body;
        var data = {};

        data.t_souvenir_id = ObjectID(reqdata.t_souvenir_id);
        data.m_souvenir_id = ObjectID(reqdata.m_souvenir_id);
        data.qty = reqdata.qty;
        data.qty_settlement = reqdata.qty_settlement;
        data.note = reqdata.note;
        data.is_delete = false;
        data.created_by = reqdata.created_by;
        data.created_date = now;
        data.updated_by = null;
        data.updated_date = null;
        
        
        var model = new tsitemModel(data);

        global.dbo.collection('t_souvenir_item').insertOne(model, function(err, data){
            if(err)
            {
                logger.info("Transaction Item Souvenir : Create Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }
            logger.info("Transaction Item Souvenir : Create successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            logger.info({data : data}, "Transaction Item Souvenir : Create content");
            Response.send(res, 200, data);
        });
    },
    // Update : (req, res, next) => {
    //     logger.info("Initialized Souvenir : Update" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

    //     let id = req.params.id;
    //     let reqdata = req.body;
    //     var oldmodel = {};
    //     var updatemodel = {};

    //     global.dbo.collection('m_souvenir').find({is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
    //         if(err)
    //         {
    //             logger.info("Souvenir : Update Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //             logger.error(err);
    //             return next(new Error());
    //         }

    //         oldmodel = data.map((entity) => {
    //             return new msouvenirModel(entity);
    //         });

    //         updatemodel._id = ObjectID(id);

    //         if(reqdata.code == null || reqdata.code == undefined || reqdata.code == "")
    //         {
    //             updatemodel.code = oldmodel[0].code;
    //         }
    //         else
    //         {
    //             updatemodel.code = reqdata.code; 
    //         }

    //         if(reqdata.name == null || reqdata.name == undefined || reqdata.name == "")
    //         {
    //             updatemodel.name = oldmodel[0].name;
    //         }
    //         else
    //         {
    //             updatemodel.name = reqdata.name;   
    //         }

    //         if(reqdata.description == null || reqdata.description == undefined || reqdata.description == "")
    //         {
    //             updatemodel.description = oldmodel[0].description;
    //         }
    //         else
    //         {
    //             updatemodel.description = reqdata.description;   
    //         }

    //         updatemodel.m_unit_id = ObjectID(reqdata.m_unit_id);
    //         updatemodel.is_delete = false;
    //         updatemodel.created_by = oldmodel[0].created_by;
    //         updatemodel.created_date = oldmodel[0].created_date;
    //         updatemodel.updated_by = oldmodel[0].updated_by;
    //         updatemodel.updated_date = now;
            
    //         var model = new msouvenirModel(updatemodel);

    //         global.dbo.collection('m_souvenir').findOneAndUpdate
    //         (
    //             {'_id' : ObjectID(id)},
    //             {$set: model},
    //             function(err, data){
    //                 if(err)
    //                 {
    //                     logger.info("Souvenir : Update Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //                     logger.error(err);
    //                     return next(new Error());
    //                 }
    //                 logger.info("Souvenir : Create successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //                 logger.info({data : data}, "Souvenir : Create content");
    //                 Response.send(res, 200, data);
    //             }
    //         );
    //     });
    // },
    // Delete : (req, res, next) => {
    //     logger.info("Initialized Souvenir : Delete" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

    //     let id = req.params.id;
    //     var oldmodel = {};
    //     var deletemodel = {};

    //     global.dbo.collection('m_souvenir').find({is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
    //         if(err)
    //         {
    //             logger.info("Souvenir : Delete Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //             logger.error(err);
    //             return next(new Error());
    //         }

    //         oldmodel = data.map((entity) => {
    //             return new msouvenirModel(entity);
    //         });

    //         deletemodel._id = ObjectID(id);
    //         deletemodel.code = oldmodel[0].code;
    //         deletemodel.name = oldmodel[0].name;
    //         deletemodel.description = oldmodel[0].description;
    //         deletemodel.m_unit_id = oldmodel[0].m_unit_id;
    //         deletemodel.is_delete = true;
    //         deletemodel.created_by = oldmodel[0].created_by;
    //         deletemodel.created_date = oldmodel[0].created_date;
    //         deletemodel.updated_by = oldmodel[0].updated_by;
    //         deletemodel.updated_date = now;

    //         var model = new msouvenirModel(deletemodel);

    //         global.dbo.collection('m_souvenir').findOneAndUpdate
    //         (
    //             {'_id' : ObjectID(id)},
    //             {$set: model},
    //             function(err, data){
    //                 if(err)
    //                 {
    //                     logger.info("Souvenir : Delete Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //                     logger.error(err);
    //                     return next(new Error());
    //                 }
    //                 logger.info("Souvenir : Delete successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
    //                 logger.info({data : data}, "Souvenir : Delete content");
    //                 Response.send(res, 200, data);
    //             }
    //         );
    //     });
    // }
};
module.exports = TSItemController;