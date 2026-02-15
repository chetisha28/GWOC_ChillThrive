const serviceService = require('../services/service.service');

const createService = async (req, res) => {
    const newService = await serviceService.createService(req.body);
    res.send(newService);
}

const getAllServices = async (req, res) => {
    const all_services = await serviceService.getAllServices();
    res.send(all_services);
}

const getServiceById = async (req, res) => {
    const service = await serviceService.getServiceById(req.params.id);
    if (!service) {
        return res.send({ message: 'Service not found' });
    }
    res.send(service);
}

const updateService = async (req, res) => {
    const updatedService = await serviceService.updateService(req.params.id, req.body);
    if (!updatedService) {
        return res.send({ message: 'Service not found' });
    }
    res.send(updatedService);
}

const deleteService = async (req, res) => {
    const deletedService = await serviceService.deleteService(req.params.id);
    if (!deletedService) {
        return res.send({ message: 'Service not found' });
    }
    res.send({ message: 'Service deleted successfully' });
}

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};