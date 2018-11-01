'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const T_Souvenir_Item = require('../models/t_souvenir_item.model');

var now = new Date();

const tsouveniritemController = {
    GetAll : (req, res, next) => {
        global.dbo.collection('t_souvenir_item').find({ is_delete : false }).toArray((error, data) => {
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            logger.info("Showing all Data Souvenir Item to " + global.user.username + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 200, data);
        });
    }
};

module.exports = tsouveniritemController;