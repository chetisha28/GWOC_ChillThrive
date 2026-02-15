const service = require('../models/service.model');

const createService = async (details) => {
    try {
        return await service.create(details);
    } catch (error) {
        throw error;
    }
}

const getAllServices = async () => {
    try {
        return await service.find({ isActive: true });
    } catch (error) {
        throw error;
    }
}

const getServiceById = async (id) => {
    try {
        return await service.findById(id);
    } catch (error) {
        throw error;
    }
}

const updateService = async (id, details) => {
    try {
        return await service.findByIdAndUpdate(id, details, { new: true, runValidators: true });
    } catch (error) {
        throw error;
    }
}

const deleteService = async (id) => {
    try {
        return await service.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
}

module.exports = { createService, getAllServices, getServiceById, updateService, deleteService };
