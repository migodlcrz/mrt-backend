"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fareController_1 = require("../controllers/fareController");
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
const fare = express_1.default.Router();
fare.use(requireAuth_1.default);
fare.get("/", requireAuth_1.default, fareController_1.getFares);
fare.get("/:id", requireAuth_1.default, fareController_1.getFare);
fare.post("/", requireAuth_1.default, fareController_1.createFare);
fare.patch("/:id", requireAuth_1.default, fareController_1.updateFare);
exports.default = fare;
