var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var secret = require('../config/dbconfig').secret;
var const AuditLogSchema = new mongoose.Schema({
  userId: String,
  action: String,
  module: String,
  description: String,
  oldValue: Object,
  newValue: Object,
  ipAddress: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("AuditLog", AuditLogSchema);
