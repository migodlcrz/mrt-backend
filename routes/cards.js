"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cardControllers_1 = require("../controllers/cardControllers");
const requireAuth_1 = __importDefault(require("../middleware/requireAuth"));
const crd = express_1.default.Router();
crd.get("/tap", cardControllers_1.getCards);
crd.get("/tap/:id", cardControllers_1.getCard);
crd.get("/", requireAuth_1.default, cardControllers_1.getCards);
crd.get("/:id", requireAuth_1.default, cardControllers_1.getCard);
crd.post("/", requireAuth_1.default, cardControllers_1.createCard);
crd.delete("/:id", requireAuth_1.default, cardControllers_1.deleteCard);
crd.patch("/:id", requireAuth_1.default, cardControllers_1.updateCard);
exports.default = crd;
