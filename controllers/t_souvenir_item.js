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
                $match : { is_delete : false}
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

            logger.info("Showing all Data Transaction Item Souvenir " + global.user.username + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 200, data);
        });
    },

    GetDetail : (req, res, next) => {
        logger.info("Initialized Transaction Item Souvenir  : GetDetail" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
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

            logger.info("Showing Detail Data Transaction Item Souvenir " + global.user.username + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 200, data);
        });
    },

    Create : (req, res, next) => {
        logger.info("Initialized Transaction Item Souvenir : Create" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        
        let reqdata = req.body;
        var data = {};

        data.t_souvenir_id  = ObjectID(reqdata.t_souvenir_id);
        data.m_souvenir_id  = ObjectID(reqdata.m_souvenir_id);
        data.qty            = reqdata.qty;
        data.qty_settlement = reqdata.qty_settlement;
        data.note           = reqdata.note;
        data.is_delete      = false;
        data.created_by     = global.user.username;
        data.created_date   = now;
        data.updated_by     = null;
        data.updated_date   = null;
        
        
        var modelCreate = new tsitemModel(data);

        global.dbo.collection('t_souvenir_item').insertOne(modelCreate, function(error, data){
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            logger.info("User " + global.user.username + " Create Data Transaction Item Souvenir at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 200, data);
        });
    },

    Update : (req, res, next) => {
        logger.info("Initialized Souvenir : Update" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

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
                return new tsitemModel(entity);
            });

            updatemodel._id = ObjectID(id);

            console.log(data);

            if(reqdata.t_souvenir_id == null || reqdata.t_souvenir_id == undefined || reqdata.t_souvenir_id == "") {
                updatemodel.t_souvenir_id = oldmodel[0].t_souvenir_id;
            } else {
                updatemodel.t_souvenir_id = ObjectID(reqdata.t_souvenir_id); 
            }

            if(reqdata.m_souvenir_id == null || reqdata.m_souvenir_id == undefined || reqdata.m_souvenir_id == "") {
                updatemodel.m_souvenir_id = oldmodel[0].m_souvenir_id;
            } else {
                updatemodel.m_souvenir_id = ObjectID(reqdata.m_souvenir_id);   
            }

            if(reqdata.qty == null || reqdata.qty == undefined || reqdata.qty == "") {
                updatemodel.qty = oldmodel[0].qty;
            } else {
                updatemodel.qty = reqdata.qty;   
            }

            if(reqdata.qty_settlement == null || reqdata.qty_settlement == undefined || reqdata.qty_settlement == "") {
                updatemodel.qty_settlement = oldmodel[0].qty_settlement;
            } else {
                updatemodel.qty_settlement = reqdata.qty_settlement;   
            }

            if(reqdata.note == null || reqdata.note == undefined || reqdata.note == "") {
                updatemodel.note = oldmodel[0].note;
            } else {
                updatemodel.note = reqdata.note;   
            }

            updatemodel.is_delete = false;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.updated_by = global.user.username;
            updatemodel.updated_date = now;
            
            var modelUpdate = new tsitemModel(updatemodel);

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

                    logger.info("User " + global.user.username + " Update Data Transaction Item Souvenir at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
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

                    logger.info("User " + global.user.username + " Delete Data Transaction Item Souvenir at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    Response.send(res, 200, data);
                }
            );
        });
    }
};
module.exports = TSItemController;
