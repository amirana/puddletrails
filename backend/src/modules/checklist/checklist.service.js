import ApiError from "../../common/utils/api-error.js";
import Checklist from "./checklist.model.js";

const getChecklists = (tripId) => Checklist.find({ trip: tripId }).sort({ createdAt: 1 });

const createChecklist = (tripId, data) => Checklist.create({ trip: tripId, ...data });

const updateChecklist = async (tripId, checklistId, { title, type }) => {
    const checklist = await Checklist.findOneAndUpdate(
        { _id: checklistId, trip: tripId },
        { $set: { title, type } },
        { returnDocument: "after", runValidators: true },
    );
    if (!checklist) throw ApiError.notFound("Checklist not found");
    return checklist;
};

const deleteChecklist = async (tripId, checklistId) => {
    const checklist = await Checklist.findOneAndDelete({ _id: checklistId, trip: tripId });
    if (!checklist) throw ApiError.notFound("Checklist not found");
};

const createItem = async (tripId, checklistId, { text }) => {
    const checklist = await Checklist.findOne({ _id: checklistId, trip: tripId });
    if (!checklist) throw ApiError.notFound("Checklist not found");
    checklist.items.push({ text });
    await checklist.save();
    return checklist;
};

const updateItem = async (tripId, checklistId, itemId, updates, role) => {
    if (updates.text !== undefined && !["owner", "editor"].includes(role)) {
        throw ApiError.forbidden("Only the trip owner or an editor can change item text");
    }
    const checklist = await Checklist.findOne({ _id: checklistId, trip: tripId, "items._id": itemId });
    if (!checklist) throw ApiError.notFound("Checklist item not found");
    const item = checklist.items.id(itemId);
    if (updates.text !== undefined) item.text = updates.text;
    if (updates.completed !== undefined) item.completed = updates.completed;
    await checklist.save();
    return checklist;
};

const deleteItem = async (tripId, checklistId, itemId) => {
    const checklist = await Checklist.findOne({ _id: checklistId, trip: tripId, "items._id": itemId });
    if (!checklist) throw ApiError.notFound("Checklist item not found");
    checklist.items.id(itemId).deleteOne();
    await checklist.save();
    return checklist;
};

const deleteChecklistsForTrip = (tripId) => Checklist.deleteMany({ trip: tripId });

export {
    getChecklists,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    createItem,
    updateItem,
    deleteItem,
    deleteChecklistsForTrip,
};
