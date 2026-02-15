const express = require("express");
const router = express.Router();
const serviceController = require('../controller/service.controller');
const adminAuth = require('../middlewares/admin.middleware');

// Public routes
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);

// Admin-only routes
router.post("/", adminAuth, serviceController.createService);
router.put("/:id", adminAuth, serviceController.updateService);
router.delete("/:id", adminAuth, serviceController.deleteService);

module.exports = router;
