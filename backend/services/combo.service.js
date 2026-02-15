const Combo = require("../models/combo.model");

const createCombo = async(data) => {
    return await Combo.create(data);
}
const getAllCombo = async() =>{
    return await Combo.find({isActive : true}).populate("services");
}
const getComboById = async(id)=>{
    return await Combo.findById(id).populate("services")
}
const updateCombo = async(id,data)=>{
    return await Combo.findByIdAndUpdate(id,data,{new:true})
}
const deleteCombo = async(id)=>{
    return await Combo.findByIdAndDelete(id);
}

module.exports = {
    createCombo,
    getAllCombo,
    getComboById,
    updateCombo,
    deleteCombo
}