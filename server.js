"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cards_1 = __importDefault(require("./routes/cards"));
const stations_1 = __importDefault(require("./routes/stations"));
const fare_1 = __importDefault(require("./routes/fare"));
const user_1 = __importDefault(require("./routes/user"));
const mongoose_1 = __importDefault(require("mongoose"));
// express app
const app = (0, express_1.default)();

app.use(express_1.default.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
// routes
app.use("/api/cards", cards_1.default);
app.use("/api/stations", stations_1.default);
app.use("/api/fare", fare_1.default);
app.use("/api/users", user_1.default);
// connect to db
const mongoUri = process.env.MONGO;
if (!mongoUri) {
  console.error(
    "MongoDB connection string is missing in the environment variables."
  );
  process.exit(1);
}
mongoose_1.default
  .connect(mongoUri)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log(
        `Database and server is running on http://localhost:${process.env.PORT}/`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
