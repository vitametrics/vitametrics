const mongoose = require('mongoose');

export interface IDevice extends Document {
    deviceId: string;
    deviceType: string;
    userFullName: string;
};


const deviceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deviceId: String,
    deviceType: String,
    heartRateData: [{ date: Date, value: Number }],
    sleepData: [{ date: Date, duration: Number, quality: String }],
    nutritionData: [{ date: Date, value: Number }],
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;