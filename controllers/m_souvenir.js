'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');
const logger = require('../config/log');
const msouvenirModel = require('../models/m_souvenir.model');
var now = new Date();

const MSouvenirController = {
    GetAll : (req, res, next) => {
        logger.info("Initialized Souvenir : GetAll" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('m_souvenir').aggregate([
            {
                $lookup : {
                from : "m_unit",
                localField : "m_unit_id",
                foreignField : "_id",
                as : "unit_lookup"
                }
            },
            {
                $unwind : "$unit_lookup"  
            },
            {
                $match : {is_delete : false}
            },
            {
                $project:
                {
                    "_id" : "$_id", 
                    "code" : "$code", 
                    "name" : "$name",
                    "description" : "$description", 
                    "quantity" : "$quantity",
                    "name_unit" : "$unit_lookup.name",
                    "m_unit_id" : "$m_unit_id",
                    //"name_unit" : "$unit_lookup.name",
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
                logger.info("Souvenir : GetAll Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            logger.info("Souvenir : GetAll successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            logger.info({data : data}, "Souvenir : GetAll content");
            Response.send(res, 200, data);
        });
    },
    GetDetail : (req, res, next) => {
        logger.info("Initialized Souvenir : GetDetail" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        let id = req.params.id;
        
        global.dbo.collection('m_souvenir').aggregate([
            {
                $lookup : {
                from : "m_unit",
                localField : "m_unit_id",
                foreignField : "_id",
                as : "unit_lookup"
                }
            },
            {
                $unwind : "$unit_lookup"  
            },
            {
                $match : {is_delete : false}
            },
            {
                $project:
                {
                    "_id" : "$_id", 
                    "code" : "$code", 
                    "name" : "$name",
                    "description" : "$description", 
                    "quantity" : "$quantity",
                    "name_unit" : "$unit_lookup.name",
                    "m_unit_id" : "$m_unit_id",
                    //"name_unit" : "$unit_lookup.name",
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
                logger.info("Souvenir : GetDetail Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            logger.info("Souvenir : GetDetail successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            logger.info({data : data}, "Souvenir : GetDetail content");
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


        global.dbo.collection('m_souvenir').aggregate([
            {
                $lookup : {
                from : "m_unit",
                localField : "m_unit_id",
                foreignField : "_id",
                as : "unit_lookup"
                }
            },
            {
                $unwind : "$unit_lookup"  
            },
            {
                $project:
                {
                    "_id" : "$_id", 
                    "code" : "$code", 
                    "name" : "$name",
                    "description" : "$description", 
                    "quantity" : "$quantity",
                    "name_unit" : "$unit_lookup.name",
                    "m_unit_id" : "$m_unit_id",
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
    Create : (req, res, next) => {
        logger.info("Initialized Souvenir : Create" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        let reqdata = req.body;
        var data = {};

        data.code = reqdata.code;
        data.name = reqdata.name;
        data.description = reqdata.description;
        data.quantity = reqdata.quantity;
        data.m_unit_id = ObjectID(reqdata.m_unit_id);
        data.is_delete = false;
        data.created_by = global.user.role;
        data.created_date = now;
        data.updated_by = null;
        data.updated_date = null;
        
        
        var model = new msouvenirModel(data);

        global.dbo.collection('m_souvenir').insertOne(model, function(err, data){
            if(err)
            {
                logger.info("Souvenir : Create Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            // let modelSuppliers = data.map((entity) => {
            //     return new suppliersModel(entity);
            // });
            logger.info("Souvenir : Create successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            logger.info({data : data}, "Souvenir : Create content");
            Response.send(res, 200, data);
        });
    },
    Update : (req, res, next) => {
        logger.info("Initialized Souvenir : Update" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        let reqdata = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('m_souvenir').find({is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                logger.info("Souvenir : Update Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new msouvenirModel(entity);
            });

            updatemodel._id = ObjectID(id);

            if(reqdata.code == null || reqdata.code == undefined || reqdata.code == "")
            {
                updatemodel.code = oldmodel[0].code;
            }
            else
            {
                updatemodel.code = reqdata.code; 
            }

            if(reqdata.name == null || reqdata.name == undefined || reqdata.name == "")
            {
                updatemodel.name = oldmodel[0].name;
            }
            else
            {
                updatemodel.name = reqdata.name;   
            }

            if(reqdata.description == null || reqdata.description == undefined || reqdata.description == "")
            {
                updatemodel.description = oldmodel[0].description;
            }
            else
            {
                updatemodel.description = reqdata.description;   
            }

            if(reqdata.quantity == null || reqdata.quantity == undefined || reqdata.quantity == "")
            {
                updatemodel.quantity = oldmodel[0].quantity;
            }
            else
            {
                updatemodel.quantity = reqdata.quantity;   
            }

            if(reqdata.m_unit_id == null || reqdata.m_unit_id == undefined || reqdata.m_unit_id == "")
            {
                updatemodel.m_unit_id = oldmodel[0].m_unit_id;
            }
            else
            {
                updatemodel.m_unit_id = ObjectID(reqdata.m_unit_id);   
            }

            updatemodel.is_delete = false;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.updated_by = global.user.role;
            updatemodel.updated_date = now;
            
            var model = new msouvenirModel(updatemodel);

            global.dbo.collection('m_souvenir').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        logger.info("Souvenir : Update Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                        logger.error(err);
                        return next(new Error());
                    }
                    logger.info("Souvenir : Create successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    logger.info({data : data}, "Souvenir : Create content");
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

        global.dbo.collection('m_souvenir').find({is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                logger.info("Souvenir : Delete Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                logger.error(err);
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new msouvenirModel(entity);
            });

            deletemodel._id = ObjectID(id);
            deletemodel.code = oldmodel[0].code;
            deletemodel.name = oldmodel[0].name;
            deletemodel.description = oldmodel[0].description;
            deletemodel.quantity = oldmodel[0].quantity;
            deletemodel.m_unit_id = oldmodel[0].m_unit_id;
            deletemodel.is_delete = true;
            deletemodel.created_by = oldmodel[0].created_by;
            deletemodel.created_date = oldmodel[0].created_date;
            deletemodel.updated_by = global.user.role;
            deletemodel.updated_date = now;

            var model = new msouvenirModel(deletemodel);

            global.dbo.collection('m_souvenir').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        logger.info("Souvenir : Delete Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                        logger.error(err);
                        return next(new Error());
                    }
                    logger.info("Souvenir : Delete successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    logger.info({data : data}, "Souvenir : Delete content");
                    Response.send(res, 200, data);
                }
            );
        });
    },
    GetAllHandlerSortByDescending : (req, res, next) => {
        logger.info("Initialized Supplier : GetAllHandlerSortByDescending" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('m_souvenir').aggregate([
            {
                $lookup : {
                from : "m_unit",
                localField : "m_unit_id",
                foreignField : "_id",
                as : "unit_lookup"
                }
            },
            {
                $unwind : "$unit_lookup"  
            },
            {
                $match : {is_delete : false}
            },
            {
                $project:
                {
                    "_id" : "$_id", 
                    "code" : "$code", 
                    "name" : "$name",
                    "description" : "$description", 
                    "quantity" : "$quantity",
                    "name_unit" : "$unit_lookup.name",
                    "m_unit_id" : "$unit_lookup._id",
                    //"name_unit" : "$unit_lookup.name",
                    "is_delete" : "$is_delete",
                    "created_by" : "$created_by",
                    "created_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$created_date" } },
                    "updated_by" : "$updated_by",
                    "updated_date" : { "$dateToString": { "format": "%Y-%m-%d", "date": "$updated_date" } }
                }
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
    }
};
module.exports = MSouvenirController;