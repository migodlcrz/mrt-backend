"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stationControllers_1 = require("../controllers/stationControllers");
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
const stn = express_1.default.Router();
stn.get("/tap", stationControllers_1.getStations);
stn.get("/tap/:id", stationControllers_1.getStation);
stn.get("/", requireAuth_1.default, stationControllers_1.getStations);
stn.get("/:id", requireAuth_1.default, stationControllers_1.getStation);
stn.use(requireAuth_1.default);
stn.post("/", requireAuth_1.default, stationControllers_1.createStation);
stn.delete("/:id", requireAuth_1.default, stationControllers_1.deleteStation);
stn.patch("/:id", requireAuth_1.default, stationControllers_1.updateStation);
exports.default = stn;
