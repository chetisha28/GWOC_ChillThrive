const { get } = require("mongoose");
const comboService = require("../services/combo.service")

const createCombo = async(req,res)=>{
    const combo = await comboService.createCombo(req.body);
    res.status(201).json({
        success : true,
        data : combo
    })
}
const getAllCombo = async(req,res)=>{
    const allCombo = await comboService.getAllCombo();
    res.status(200).json({
        success : true,
        data : allCombo
    })
}
const getAllComboById = async(req,res)=>{
    const allComboById = await comboService.getAllComboById(req.params.id);
    res.status(200).json({
        success : true,
        data : allComboById
    })
}
const updateCombo = async(req,res)=>{
    const updatedCombo = await comboService.updateCombo(req.params.id,req.body);
    res.status(200).json({
        success : true,
        data : updatedCombo
    })
}
const deleteCombo = async(req,res)=>{
    const deletedCombo = await comboService.deleteCombo(req.params.id);
    res.status(200).json({
        success : true,
        data : deletedCombo
    })
}

module.exports = {
    createCombo,
    getAllCombo,
    getAllComboById,
    updateCombo,
    deleteCombo
}