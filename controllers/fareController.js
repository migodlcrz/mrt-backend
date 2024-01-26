"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFare = exports.createFare = exports.getFare = exports.getFares = void 0;
const fareModel_1 = __importDefault(require("../models/fareModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const getFares = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fare = yield fareModel_1.default.find({}).sort({ createdAt: -1 });
    res.status(200).json(fare);
});
exports.getFares = getFares;
const getFare = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).send("The provided ID was not valid.");
    }
    const fare = yield fareModel_1.default.findById(id);
    if (!fare) {
        return res.status(404).json({ error: "No Fare exists." });
    }
    res.status(200).json(fare);
});
exports.getFare = getFare;
const createFare = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { minimumAmount, perKM } = req.body;
    try {
        const fare = yield fareModel_1.default.create({
            minimumAmount,
            perKM,
        });
        res.status(200).json(fare);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.createFare = createFare;
const updateFare = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).send("The provided ID was not valid.");
    }
    const fare = yield fareModel_1.default.findOneAndUpdate({ _id: id }, Object.assign({}, req.body));
    if (!fare) {
        return res.status(404).json({ error: "Fare does not exist." });
    }
    res.status(200).json(fare);
});
exports.updateFare = updateFare;
