'use strict'

const moment = require('moment');
const logger = require('../config/log');
const Response = require('../config/response');
const m_companymodel = require('../models/m_company.model')

const CompanyController = {
    GetAll : (req, res, next) => {

        logger.info("Initializing Company - getAll" + " at " + moment().format('DD/MM/YYYY, hh:mm:ss a'));
        
        global.dbo.collection('m_company').find( {is_delete : false}).toArray((err, data) => {
            if(err){
                return next (new Error());
            }
            
            let model = data.map((entity) => {
                return new m_companymodel(entity);
            });

            Response.send(res, 200, model);
        });
    }
}

module.exports = CompanyController;