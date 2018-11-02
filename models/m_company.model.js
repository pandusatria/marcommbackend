'use strict'

function model (entity){
    this._id                = entity._id;
    this.code               = entity.code;
    this.name                = entity.name;
    this.address            = entity.address;
    this.phone              = entity.phone;
    this.email              = entity.email;
    this.is_delete          = entity.is_delete;
    this.created_by         = entity.created_by;
    this.created_date       = entity.created_date;
    this.updated_by         = entity.updated_by;
    this.updated_date       = entity.updated_date;
}

model.prototype.getData = function(){
    return {
        _id             : this.is_delete,
        code            : this.code,
        name            : this.name,
        address         : this.address,
        phone           : this.phone,
        email           : this.email,
        is_delete       : this.is_delete,
        created_by      : this.created_by,
        created_date    : this.created_date,
        updated_by      : this.updated_by,
        updated_date    : this.updated_date
    };
};

module.exports = model;