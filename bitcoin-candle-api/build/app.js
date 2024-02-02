"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cors = require("cors");
var express = require("express");
var logger = require("morgan");
var candles_1 = require("./routes/candles");
var app = express();
app.use(cors());
app.use(logger("dev"));
app.use('/candles', candles_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map