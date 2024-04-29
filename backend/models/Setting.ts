import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    type: { type: String, unique: true},
    value: Boolean
});

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;