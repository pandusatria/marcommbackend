'use strict';

function model (entity)
{
    this._id            =   entity._id;
    this.t_souvenir_id  =   entity.t_souvenir_id;
    this.m_souvenir_id  =   entity.m_souvenir_id;
    this.qty            =   entity.qty;
    this.qty_settlement =   entity.qty_settlement;
    this.note           =   entity.note;
    this.is_delete      =   entity.is_delete;
    this.created_by     =   entity.created_by;
    this.created_date   =   entity.created_date;
    this.updated_by     =   entity.updated_by;
    this.updated_date   =   entity.updated_date;
}

model.prototype.getData = function()
{
    return {
        _id             : this._id,
        t_souvenir_id   : this.t_souvenir_id,
        m_souvenir_id   : this.m_souvenir_id,
		qty             : this.qty,
        qty_settlement  : this.qty_settlement,
        note            : this.note,
		is_delete       : this.is_delete,
        created_by      : this.created_by,
        created_date    : this.created_date,
		updated_by      : this.updated_by,
		updated_date    : this.updated_date,
    };
};

module.exports = model;