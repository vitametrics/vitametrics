"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
;
const deviceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deviceId: String,
    deviceType: String,
    heartRateData: [{ date: Date, value: Number }],
    sleepData: [{ date: Date, duration: Number, quality: String }],
    nutritionData: [{ date: Date, value: Number }],
    lastSyncDate: [{ date: Date }]
});
const Device = mongoose.model('Device', deviceSchema);
exports.default = Device;
//# sourceMappingURL=Device.js.map