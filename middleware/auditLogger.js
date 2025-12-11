// middleware/auditLogger.js
const AuditLog = require("../models/AuditLog");

async function auditLog({ userId, action, module, description, oldValue, newValue, ip }) {
  try {
    await AuditLog.create({
      userId,
      action,
      module,
      description,
      oldValue,
      newValue,
      ipAddress: ip,
    });
  } catch (e) {
    console.log("Audit log error:", e.message);
  }
}

module.exports = auditLog;
