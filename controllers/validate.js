'use strict';

const Response = require('../config/response')
const ObjectID = require('mongodb').ObjectID;

const validate = {
    checkNumber : (req, res, next) => {
        var employee_number = req.params.employee_number;

        // if(nama_client == null){
        //     Response.send(res, 403, "You are not authorized");
        // }else{
            global.dbo.collection('m_employee').findOne({ employee_number : employee_number}, (err, data) => {
                if(data){
                    let doc = {
                        message : "existing",
                        content : { "_id" : ObjectID(data._id), "employee_number" : data.employee_number }
                    };
                    Response.send(res, 200, doc);
                }else{
                    Response.send(res, 200, "not exist");
                }
            });
    },

    checkUsername : (req, res, next) => {
        var username = req.params.username;

        global.dbo.collection('m_user').findOne({ username : username }, (err, data) => {
            if(data) {
                let doc = {
                    message : "existing",
                    content : { "_id" : ObjectID(data._id), "username" : data.username }
                };
                Response.send(res, 200, doc);
            } else{
                Response.send(res, 200, "not exist");
            }
        });
    }
};

module.exports = validate;