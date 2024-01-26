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
exports.createUser = exports.loginUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (_id, email) => {
    const secretOrPrivateKey = process.env.SECRET || "";
    return jsonwebtoken_1.default.sign({ _id: _id, email: email }, secretOrPrivateKey, {
        expiresIn: "1h",
    });
};
// login a user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "All fields must be filled." });
        return;
    }
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        res.status(400).json({ error: "Email Invalid." });
        return;
    }
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match) {
        res.status(400).json({ error: "Incorrect password." });
        return;
    }
    try {
        const token = createToken(user._id, user.email);
        const user_ = user.email;
        const pass_ = user.password;
        res.status(200).json({ user_, jwt: token });
        // res.status(200).json({ jwt: token });
    }
    catch (error) {
        res.status(400).json({ error: "INTERNAL ERROR" });
    }
});
exports.loginUser = loginUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "All fields must be filled." });
        return;
    }
    if (!validator_1.default.isEmail(email)) {
        res.status(400).json({ error: "Invalid email." });
        return;
    }
    if (!validator_1.default.isStrongPassword(password)) {
        res.status(400).json({
            error: "Password must be at least 8 characters long, should contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.",
        });
        return;
    }
    const exist = yield userModel_1.default.findOne({ email });
    if (exist) {
        res.status(400).json({ error: "Email already exists." });
        return;
    }
    try {
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const user = yield userModel_1.default.create({ email, password: hashedPassword });
        const token = createToken(user._id, user.email);
        const user_ = user.email;
        const pass_ = user.password;
        res.status(200).json({ user_, token });
    }
    catch (error) {
        res.status(400).json({ error: "INTERNAL ERROR" });
    }
});
exports.createUser = createUser;
