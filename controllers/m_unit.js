'use strict'

const moment = require('moment');
const logger = require('../config/log');
const Response = require('../config/response');
const munitModel = require('../models/m_unit.model');

const UnitController = {
    GetAll : (req, res, next) => {

        logger.info("Initializing Unit - getAll" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        
        global.dbo.collection('m_unit').find( {is_delete : false}).toArray((err, data) => {
            if(err){
                return next (new Error());
            }
            
            let model = data.map((entity) => {
                return new munitModel(entity);
            });

            Response.send(res, 200, model);
        });
    }
}

module.exports = UnitController;