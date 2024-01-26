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
exports.deleteCard = exports.updateCard = exports.createCard = exports.getCard = exports.getCards = void 0;
const cardModel_1 = __importDefault(require("../models/cardModel"));
const mongoose_1 = __importDefault(require("mongoose"));
//GET all cards
const getCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cards = yield cardModel_1.default.find({}).sort({ createdAt: -1 });
    res.status(200).json(cards);
});
exports.getCards = getCards;
//GET one card
const getCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Card does not exist." });
    }
    const card = yield cardModel_1.default.findById(id);
    if (!card) {
        return res.status(404).json({ error: "Card does not exist." });
    }
    res.status(200).json(card);
});
exports.getCard = getCard;
//CREATE a card
const createCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, balance } = req.body;
    try {
        const card = yield cardModel_1.default.create({ uid, balance });
        res.status(200).json(card);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.createCard = createCard;
//UPDATE a card
const updateCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Card does not exist." });
    }
    const { balance } = req.body;
    if (balance < 1) {
        return res.status(404).json({ error: "Balance cannot be negative." });
    }
    const card = yield cardModel_1.default.findById(id);
    if (!card) {
        return res.status(404).json({ error: "Card does not exist." });
    }
    if (card.balance + balance > 10000) {
        return res.status(404).json({ error: "Balance cannot exceed 10000." });
    }
    card.balance += balance;
    yield card.save();
    res.status(200).json(card);
});
exports.updateCard = updateCard;
//DELETE a card
const deleteCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid card ID." });
    }
    const card = yield cardModel_1.default.findOneAndDelete({ _id: id });
    if (!card) {
        return res.status(404).json({ error: "Card does not exist." });
    }
    res.status(200).json(card);
});
exports.deleteCard = deleteCard;
