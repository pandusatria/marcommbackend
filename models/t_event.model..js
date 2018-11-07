'use strict'

function model (entity){
    this._id            = entity._id;
    this.code           = entity.code;
    this.event_name     =  entity.event_name; 
    this.start_date     = entity.start_date; 
    this.end_date       = entity.end_date; 
    this.place          = entity.place; 
    this.budget         = entity.budget; 
    this.request_by     = entity.request_by; 
    this.request_date   = entity.request_date; 
    this.approved_by    = entity.approved_by; 
    this.approved_date  = entity.approved_date; 
    this.assign_to      = entity.assign_to; 
    this.closed_date    = entity.closed_date; 
    this.note           = entity.note; 
    this.status         = entity.status; 
    this.reject_reason  = entity.reject_reason; 
    this.is_delete      = entity.is_delete; 
    this.created_by     = entity.created_by; 
    this.created_date   = entity.created_date; 
    this.updated_by     = entity.updated_by; 
    this.updated_date   = entity.updated_date;
}

model.prototype.getData = function(){
    return {
        _id             : this._id,
        code            : this.code,
        event_name      :  this.event_name, 
        start_date      : this.start_date, 
        end_date        : this.end_date, 
        place           : this.place, 
        budget          : this.budget, 
        request_by      : this.request_by, 
        request_date    : this.request_date, 
        approved_by     : this.approved_by, 
        approved_date   : this.approved_date, 
        assign_to       : this.assign_to, 
        closed_date     : this.closed_date, 
        note            : this.note, 
        status          : this.status, 
        reject_reason   : this.reject_reason, 
        is_delete       : this.is_delete, 
        created_by      : this.created_by, 
        created_date    : this.created_date, 
        updated_by      : this.updated_by, 
        updated_date    : this.updated_date,
    }
}

module.exports = model;