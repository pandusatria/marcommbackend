'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;

const jwt = require('jsonwebtoken');
const secret = require('../config/token');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const logger = require('../config/log');

var now = new Date();


const UserModel = require('../models/m_user.model');

const userController = {
    Login : (req, res, next) => {
        var username = req.body.username;
        var password = req.body.password;

        logger.info("Initialized Login" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        if(username == null || password == null) {
            logger.info("Login Failed, username / password is null" + " Try to Login at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 404, "Username or Password is null");
        } else {
<<<<<<< HEAD
           global.dbo.collection('m_user').aggregate([
=======
            global.dbo.collection('m_user').aggregate([
>>>>>>> origin/lutfi
                {
                    $match : 
                    { 
                        is_delete : false,
<<<<<<< HEAD
                        username : username 
=======
                        username : username
>>>>>>> origin/lutfi
                    }
                },
                {
                    $lookup :
                    {
                        from : "m_role",
                        localField : "m_role_id",
                        foreignField : "_id",
                        as : "Show_Role"
                    }
                },
                {
                    $unwind : "$Show_Role"
                },
                {
                    $lookup :
                    {
                        from : "m_employee",
                        localField : "m_employee_id",
                        foreignField : "_id",
                        as : "Show_Employee"
                    }
                },
                {
                    $unwind : "$Show_Employee"
                },
                {
                    $project :
                    {
                        username : "$username",
                        password : "$password",
                        role : "$Show_Role.name",
<<<<<<< HEAD
                        employe : { $concat: [ "$Show_Employee.first_name", " ", "$Show_Employee.last_name" ] },
=======
                        employee : { $concat: [ "$Show_Employee.first_name", " ", "$Show_Employee.last_name" ] },
>>>>>>> origin/lutfi
                        email : "$Show_Employee.email",
                        is_delete : "$is_delete",
                        created_by : "$created_by",
                        created_date : "$created_date",
                        update_by : "$updated_by",
                        update_date : "$updated_date"
                    }
                }
           ]).toArray((error, data) => {
            console.log("cek data");   
            console.log(data);
                if(data.length > 0) {
                    logger.info("Username : " + data[0].username + " Try to Login at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    console.log("Debug");
                    console.log(data);
                    console.log(data[0].password);
                    if(bcrypt.compareSync(password, data[0].password)) {
                        let token = jwt.sign(data[0], secret.secretkey, {
                            expiresIn: 7200 // 3600 * 2 = 2jam
                        });

                        delete data.password;

                        let doc = {
                            userdata : data,
                            token : token
                        };

                        logger.info("Username : " + data.username + " Success Login at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                        Response.send(res, 200, doc);
                    } else {
                        logger.info("Login Failed, password does not exist" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                        Response.send(res, 404, "Password wrong");
                    }

                } else {
                    logger.info("Login Failed, user does not exist" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    Response.send(res, 404, "User Does not Exist");
                } 
           });
        }
    },

    Logout : (req, res, next) => {
        logger.info("Initialized Logout" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let doc = {
            status : "Logout Success",
            userdata : null,
            token : null
        }

        logger.info("User Success Logout at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        Response.send(res, 200, doc);
    },

    GetAll : (req, res, next) => {
        logger.info("Initialized Master User : GetAll" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('m_user').aggregate([
            {
                $match : { is_delete : false }
            },
            {
                $lookup :
                {
                    from : "m_role",
                    localField : "m_role_id",
                    foreignField : "_id",
                    as : "Show_Role"
                }
            },
            {
                $unwind : "$Show_Role"
            },
            {
                $lookup :
                {
                    from : "m_employee",
                    localField : "m_employee_id",
                    foreignField : "_id",
                    as : "Show_Employee"
                }
            },
            {
                $unwind : "$Show_Employee"
            },
            {
                $project :
                {
                    username : "$username",
                    password : "$password",
                    role : "$Show_Role.name",
                    m_role_id : "$m_role_id",
                    employe : { $concat: [ "$Show_Employee.first_name", " ", "$Show_Employee.last_name" ] },
                    email : "$Show_Employee.email",
<<<<<<< HEAD
=======
                    company : "$Show_Company.name",
>>>>>>> origin/lutfi
                    is_delete : "$is_delete",
                    created_by : "$created_by",
                    created_date : "$created_date",
                    update_by : "$updated_by",
                    update_date : "$updated_date"
                }
            }
        ]).toArray((error, data) => {
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            logger.info("Showing all Data User to " + global.user.username + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 200, data);
        });
    },

    GetDetail : (req, res, next) => {
        logger.info("Initialized Master User : GetDetail" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        let id = req.params.id;

        global.dbo.collection('m_user').aggregate([
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
                    from : "m_role",
                    localField : "m_role_id",
                    foreignField : "_id",
                    as : "Show_Role"
                }
            },
            {
                $unwind : "$Show_Role"
            },
            {
                $lookup :
                {
                    from : "m_employee",
                    localField : "m_employee_id",
                    foreignField : "_id",
                    as : "Show_Employee"
                }
            },
            {
                $unwind : "$Show_Employee"
            },
            {
                $project :
                {
                    username : "$username",
                    password : "$password",
                    role : "$Show_Role.name",
                    employee : { $concat: [ "$Show_Employee.first_name", " ", "$Show_Employee.last_name" ] },
                    is_delete : "$is_delete",
                    created_by : "$created_by",
                    created_date : "$created_date",
                    update_by : "$updated_by",
                    update_date : "$updated_date"
                }
            }
        ]).toArray((error, data) => {
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            logger.info("Showing Detail Data User to " + global.user.username + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 200, data);           
        });
    },

    Create : (req, res, next) => {
        logger.info("Initialized Master User : Create" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let reqdata = req.body;
        var data = {};

        data.username       = reqdata.username;
        data.password       = bcrypt.hashSync(reqdata.password, 8);
        data.m_role_id      = ObjectID(reqdata.m_role_id);
        data.m_employee_id  = ObjectID(reqdata.m_employee_id);
        data.is_delete      = false;
        data.created_by     = global.user.username;
        data.created_date   = now;
        data.updated_by     = null;
        data.updated_date   = null;

        var modelCreate = new UserModel(data);

        global.dbo.collection('m_user').insertOne(modelCreate, function(error, data){
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            logger.info("User " + global.user.username + " Create Data User at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 200, data);  
        });
    },

    Update : (req, res, next) => {
        logger.info("Initialized Master User : Update" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        let reqdata = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('m_user').find({ is_delete : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            oldmodel = data.map((entity) =>{
                return new UserModel(entity);
            });

            // insert with condition
            updatemodel._id = ObjectID(id);

            if(reqdata.username == null || reqdata.username == undefined || reqdata.username == "") {
                updatemodel.username = oldmodel[0].username;
            } else {
                updatemodel.username = reqdata.username;
            }

            if(reqdata.password == null || reqdata.password == undefined || reqdata.password == "") {
                updatemodel.password = oldmodel[0].password;
            } else {
                updatemodel.password = bcrypt.hashSync(reqdata.password);
            }
            
            // tes oldmodel tanpa objectid dont forget that!!
            if(reqdata.m_role_id == null || reqdata.m_role_id == undefined || reqdata.m_role_id == "") {
                updatemodel.m_role_id = oldmodel[0].m_role_id;
            } else {
                updatemodel.m_role_id = ObjectID(reqdata.m_role_id);
            }

            if(reqdata.m_employee_id == null || reqdata.m_employee_id == undefined || reqdata.m_employee_id == "") {
                updatemodel.m_employee_id = oldmodel[0].m_employee_id;
            } else {
                updatemodel.m_employee_id = ObjectID(reqdata.m_employee_id);
            }

            updatemodel.is_delete = false;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.updated_by = global.user.username;
            updatemodel.updated_date = now;

            var modelUpdate = new UserModel(updatemodel);

            global.dbo.collection('m_user').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: modelUpdate},
                function(err, data){
                    if(err)
                    {
                        logger.error(error);
                        return next(new Error());
                    }

                    logger.info("User " + global.user.username + " Update Data User at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    Response.send(res, 200, data);
                }
            );
        });
    },

    Delete : (req, res, next) => {
        logger.info("Initialized Master User : Delete" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        let id = req.params.id;
        var oldmodel = {};
        var deletemodel = {};

        global.dbo.collection('m_user').find({ is_delete : false, '_id' : ObjectID(id) }).toArray((error, data) => {
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new UserModel(entity);
            });

            deletemodel._id             = ObjectID(id);
            deletemodel.username        = oldmodel[0].username;
            deletemodel.password        = oldmodel[0].password;
            deletemodel.m_role_id       = ObjectID(oldmodel[0].m_role_id);
            deletemodel.m_employee_id   = ObjectID(oldmodel[0].m_employee_id);
            deletemodel.is_delete       = true;
            deletemodel.created_by      = oldmodel[0].created_by;
            deletemodel.created_date    = oldmodel[0].created_date;
            deletemodel.updated_by      = global.user.username;
            deletemodel.updated_date    = now;

            var modelDelete = new UserModel(deletemodel);

            global.dbo.collection('m_user').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: modelDelete},
                function(err, data){
                    if(err)
                    {
                        logger.error(error);
                        return next(new Error());
                    }

                    logger.info("User " + global.user.username + " Delete Data User at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
                    Response.send(res, 200, data);
                }
            );

        });
    }
};

module.exports = userController;