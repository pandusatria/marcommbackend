'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;

const moment = require('moment');
const logger = require('../config/log');

const roleController = {
    GetAll : (req, res, next) => {
        logger.info("Initialized Master Role : GetAll" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));

        global.dbo.collection('m_role').find({ is_delete : false }).toArray((error, data) => {
            if(error) {
                logger.error(error);
                return next(new Error());
            }

            logger.info("Showing all Data Role to " + global.user.username + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
            Response.send(res, 200, data);
        });
    },
};

module.exports = roleController;