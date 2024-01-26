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
exports.deleteStation = exports.updateStation = exports.createStation = exports.getStation = exports.getStations = void 0;
const stationModel_1 = __importDefault(require("../models/stationModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const getStations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stations = yield stationModel_1.default.find({}).sort({ createdAt: -1 });
    res.status(200).json(stations);
});
exports.getStations = getStations;
const getStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).send({ error: "Invalid ID input." });
    }
    const station = yield stationModel_1.default.findById(id);
    if (!station) {
        res.status(404).json({ error: "Station does not exist" });
    }
    res.status(200).json(station);
});
exports.getStation = getStation;
const createStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, name, long, lat } = req.body;
    try {
        const station = yield stationModel_1.default.create({
            uid,
            name,
            long,
            lat,
        });
        res.status(200).json(station);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.createStation = createStation;
const updateStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID input." });
    }
    const station = yield stationModel_1.default.findOneAndUpdate({ _id: id }, Object.assign({}, req.body));
    if (!station) {
        return res.status(404).json({ error: "Station does not exist." });
    }
    res.status(200).json(station);
});
exports.updateStation = updateStation;
const deleteStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID input." });
    }
    const station = yield stationModel_1.default.findOneAndDelete({ _id: id });
    if (!station) {
        return res.status(404).send({ error: "User not found." });
    }
    res.status(200).json(station);
});
exports.deleteStation = deleteStation;
