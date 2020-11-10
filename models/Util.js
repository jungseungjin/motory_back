let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let log_session = new Schema({});
exports.log_session = mongoose.model("log_session", log_session);
