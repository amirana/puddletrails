import ApiResponse from "../../common/utils/api-response.js";
import * as checklistService from "./checklist.service.js";

const getChecklists = async (req, res) => {
    const checklists = await checklistService.getChecklists(req.params.tripId);
    ApiResponse.ok(res, "Checklists fetched successfully", checklists);
};

const createChecklist = async (req, res) => {
    const checklist = await checklistService.createChecklist(req.params.tripId, req.body);
    ApiResponse.created(res, "Checklist created successfully", checklist);
};

const updateChecklist = async (req, res) => {
    const checklist = await checklistService.updateChecklist(req.params.tripId, req.params.checklistId, req.body);
    ApiResponse.ok(res, "Checklist updated successfully", checklist);
};

const deleteChecklist = async (req, res) => {
    await checklistService.deleteChecklist(req.params.tripId, req.params.checklistId);
    ApiResponse.ok(res, "Checklist deleted successfully");
};

const createItem = async (req, res) => {
    const checklist = await checklistService.createItem(req.params.tripId, req.params.checklistId, req.body);
    ApiResponse.created(res, "Checklist item created successfully", checklist);
};

const updateItem = async (req, res) => {
    const checklist = await checklistService.updateItem(
        req.params.tripId,
        req.params.checklistId,
        req.params.itemId,
        req.body,
        req.membership.role,
    );
    ApiResponse.ok(res, "Checklist item updated successfully", checklist);
};

const deleteItem = async (req, res) => {
    const checklist = await checklistService.deleteItem(req.params.tripId, req.params.checklistId, req.params.itemId);
    ApiResponse.ok(res, "Checklist item deleted successfully", checklist);
};

export { getChecklists, createChecklist, updateChecklist, deleteChecklist, createItem, updateItem, deleteItem };
