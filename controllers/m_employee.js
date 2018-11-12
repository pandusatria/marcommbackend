'use strict';
const moment = require('moment');
const logger = require('../config/log');
const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const m_employeeModel = require('../models/m_employee.model');

// const now = moment().format();
const now = new Date();

const EmployeeController = {
    GetAll : (req, res, next) => {
        logger.info("Initializing Employee - getAll" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('m_employee').aggregate([
            {
              $lookup:
              {
                from : "m_company",
                localField : "m_company_id",
                foreignField : "_id",
                as : "company_lookup"
              }
            },
            {
              $unwind : "$company_lookup"
            },
            {
              $match: { "is_delete" : false }
            },
            {
              $project:
              {
                _id : 1,
                employee_number : "$employee_number",
                employee_name : { $concat: [ "$first_name", " ", "$last_name" ] },
                first_name : "$first_name",
                last_name : "$last_name",
                m_company_id : "$company_lookup._id",
                company_name : "$company_lookup.name",
                email : "$email",
                is_delete : "$is_delete",
                created_by : "$created_by",
                created_date : "$created_date",
                updated_by : "$updated_by",
                updated_date : "$updated_date" 
              }
            }
            ]).toArray((err, data) => {
                if(err){
                    logger.info("Employee - Get All Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
                    logger.error(err)
                    return next(new Error());
                }
                    logger.info("Employee - Get All Successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
                    logger.info( { data, data} )
                    Response.send(res, 200, data);
            });
    },

    GetDetail : (req, res,  next) => {
        let id = req.params.id;
        logger.info("Initializing Employee - getAllEmployee By Id" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('m_employee').aggregate([
            {
              $lookup:
              {
                from : "m_company",
                localField : "m_company_id",
                foreignField : "_id",
                as : "company_lookup"
              }
            },
            {
              $unwind : "$company_lookup"
            },
            {
              $match: 
                { 
                    "is_delete" : false,
                    "_id" : ObjectID(id)
                }
            },
            {
              $project:
              {
                _id : 1,
                employee_number : "$employee_number",
                employee_name : { $concat: [ "$first_name", " ", "$last_name" ] },
                first_name : "$first_name",
                last_name : "$last_name",
                company_name : "$company_lookup.name",
                email : "$email",
                is_delete : "$is_delete",
                created_by : "$created_by",
                created_date : "$created_date",
                updated_by : "$updated_by",
                updated_date : "$updated_date" 
              }
            }
            ]).toArray((err, data) => {
                if(err){
                    logger.info("Employee - Get All Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
                    logger.error(err)
                    return next(new Error());
                }
                    logger.info("Employee - Get All Successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
                    logger.info( { data, data} )
                    Response.send(res, 200, data);
            });
    },

    Create : (req, res, next) => {
        let reqdata = req.body;
        var data = {};

        data.employee_number    = reqdata.employee_number;
        data.first_name         = reqdata.first_name;
        data.last_name          = reqdata.last_name;
        data.m_company_id       = ObjectID(reqdata.m_company_id);
        data.email              = reqdata.email;
        data.is_delete          = false;
        data.created_by         = global.user.role;
        data.created_date       = now;
        data.updated_by         = null;
        data.updated_date       = null;

        var model = new m_employeeModel(data);

        global.dbo.collection('m_employee').insertOne(model, function (err, data) {
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

    Update : (req, res, next) => {
        logger.info("Initializing Employee - Update" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        let reqdata = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('m_employee').find( { is_delete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err){
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new m_employeeModel(entity);
            });

            updatemodel._id = ObjectID(id);
            
            console.log("Masuk");
            console.log(oldmodel)

            if(reqdata.employee_number == null || reqdata.employee_number == undefined || reqdata.employee_number == "") 
            {
                updatemodel.employee_number = oldmodel[0].employee_number;
            }else{
                updatemodel.employee_number = reqdata.employee_number;
            }

            if(reqdata.first_name == null || reqdata.first_name == undefined || reqdata.first_name == "") 
            {
                updatemodel.first_name = oldmodel[0].first_name;
            }else{
                updatemodel.first_name = reqdata.first_name;
            }

            if(reqdata.last_name == null || reqdata.last_name == undefined || reqdata.last_name == "") 
            {
                updatemodel.last_name = oldmodel[0].last_name;
            }else{
                updatemodel.last_name = reqdata.last_name;
            }

            if(reqdata.m_company_id == null || reqdata.m_company_id == undefined || reqdata.m_company_id == "") 
            {
                updatemodel.m_company_id = oldmodel[0].m_company_id;
            }else{
                updatemodel.m_company_id = ObjectID(reqdata.m_company_id);
            }

            if(reqdata.email == null || reqdata.email == undefined || reqdata.email == "") 
            {
                updatemodel.email = oldmodel[0].email;
            }else{
                updatemodel.email = reqdata.email;
            }

            updatemodel.is_delete          = oldmodel[0].is_delete;
            updatemodel.created_by         = oldmodel[0].created_by;
            updatemodel.created_date       = oldmodel[0].created_date;
            updatemodel.updated_by         = global.user.role;
            updatemodel.updated_date       = now;

            var model = new m_employeeModel(updatemodel);

            global.dbo.collection('m_employee').findOneAndUpdate
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

    Delete : (req, res, next) => {
        let id = req.params.id;
        var oldmodel = {};
        var deletemodel = {};

        global.dbo.collection('m_employee').find({ is_delete : false, '_id' : ObjectID(id)}).toArray((err, data)=> {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new m_employeeModel(entity);
            });

            deletemodel._id                 = ObjectID(id);
            deletemodel.employee_number    = oldmodel[0].employee_number;
            deletemodel.first_name         = oldmodel[0].first_name;
            deletemodel.last_name          = oldmodel[0].last_name;
            deletemodel.m_company_id       = oldmodel[0].m_company_id;
            deletemodel.email              = oldmodel[0].email;
            deletemodel.is_delete          = true;
            deletemodel.created_by         = oldmodel[0].created_by;
            deletemodel.created_date       = oldmodel[0].created_date;
            deletemodel.updated_by         = global.user.role;
            deletemodel.updated_date       = now;

            var model = new m_employeeModel(deletemodel);

            global.dbo.collection('m_employee').findOneAndUpdate
            (
                { '_id' : ObjectID(id)},
                { $set : model },
                function(err, data){
                    if(err)
                    {
                        return next(new Error());
                    }

                    Response.send(res, 200, data);
                }
            );
        });
    },

    GetNew : (req, res, next) => {
        logger.info("Initializing Employee - getNew" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('m_employee').aggregate([
            {
                $lookup :
                {
                    from : "m_user",
                    localField : "_id",
                    foreignField : "m_employee_id",
                    as : "Show_User"
                }
            },
            {
                $unwind :
                {
                	path: "$Show_User",
                	preserveNullAndEmptyArrays: true
                } 
            },
            {
            	$project :
            	{
            		_id : "$_id",
            		employee_name : { $concat: [ "$first_name", " ", "$last_name" ] },
            		username : { $ifNull: ["$Show_User.username", "Null"] },
            		is_delete : "$is_delete"
            	}
            },
            {
                $match : 
                { 
                  is_delete : false,
                  username : "Null"
                }
            }
        ]).toArray((err, data) => {
                if(err){
                    logger.info("Employee - Get New Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
                    logger.error(err)
                    return next(new Error());
                }

                logger.info("Employee - Get New Successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
                logger.info( { data, data} )
                Response.send(res, 200, data);
        });
    },

    GetNewEdit : (req, res, next) => {
        logger.info("Initializing Employee - getNewEdit" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
        
        let id = req.params.id;

        global.dbo.collection('m_employee').aggregate([
            {
                $lookup :
                {
                    from : "m_user",
                    localField : "_id",
                    foreignField : "m_employee_id",
                    as : "Show_User"
                }
            },
            {
                $unwind :
                {
                	path: "$Show_User",
                	preserveNullAndEmptyArrays: true
                } 
            },
            {
            	$project :
            	{
            		_id : "$_id",
            		employee_name : { $concat: [ "$first_name", " ", "$last_name" ] },
            		username : { $ifNull: ["$Show_User.username", "Null"] },
            		is_delete : "$is_delete"
            	}
            },
            {
                $match: 
                { 
                  $or: 
                    [
                      { is_delete : false, username : "Null" }, 
                      { is_delete : false, _id : ObjectID(id) }
                    ] 
                }
            }
        ]).toArray((error, data) => {
            if(error) {
                logger.info("Employee - Get New Edit Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
                logger.error(err)
                return next(new Error());
            }

            logger.info("Employee - Get New Edit Successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
            logger.info( { data, data} )
            Response.send(res, 200, data);
        });
    },
    GetEmployeeStaff : (req, res, next) => {
        logger.info("Initializing Employee - get Employee which Role is Staff" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
        global.dbo.collection('m_employee').aggregate([
            {
                $lookup:
                    {
                        from : "m_user",
                        localField : "_id",
                        foreignField : "m_employee_id",
                        as : "user_lookup"
                    }
            },
            {
                $unwind : "$user_lookup"
            },
            {
                $lookup:
                    {
                        from : "m_role",
                        localField : "user_lookup.m_role_id",
                        foreignField : "_id",
                        as : "role_lookup"
                    }
            },
            {
                $unwind : "$role_lookup"
            },
            {
                $match : 
                    { 	
                        "is_delete" : false,
                        "user_lookup.m_role_id" : ObjectID("5bdb237ce0ec449e62ebdba7") 
                    } 
            },
            {
                $project:
                    {
                        "employee_number" : "$employee_number",
                        "employee_name" : { $concat: [ "$first_name", " ", "$last_name" ] },
                        "m_employee_id" : "$user_lookup.m_employee_id",
                        "m_role_id" : "$user_lookup.m_role_id",
                        "role" : "$role_lookup.name",
                        _id :1
                    }
            }
            ]).toArray((err, data) => {
                if(err){
                    logger.info("Employee - get Employee which Role is Staff Error" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
                    logger.error(err)
                    return next(new Error());
                }
                    logger.info("Employee - get Employee which Role is Staff Successfully" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'))
                    logger.info( { data, data} )
                    Response.send(res, 200, data);
            });
    }
}
 
module.exports = EmployeeController;