#include <napi.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <locale>
#include <codecvt>
#include <fit_decode.hpp>
#include <fit_mesg_broadcaster.hpp>
#include <fit_developer_field_description.hpp>

class Listener
    : public fit::FileIdMesgListener,
      public fit::UserProfileMesgListener,
      public fit::MonitoringMesgListener,
      public fit::DeviceInfoMesgListener,
      public fit::MesgListener,
      public fit::DeveloperFieldDescriptionListener,
      public fit::RecordMesgListener {
public:
    Napi::Env env;
    Napi::Array data;

    Listener(Napi::Env env) : env(env), data(Napi::Array::New(env)) {}

    // std::string WStringToString(const std::wstring& wstr) {
    //     std::wstring_convert<std::codecvt_utf8<wchar_t>> conv;
    //     return conv.to_bytes(wstr);
    // }

    void AddMessage(const fit::Mesg& mesg) {
        Napi::Object obj = Napi::Object::New(env);
        obj.Set("name", mesg.GetName());

        Napi::Array fieldsArray = Napi::Array::New(env);
        for (int i = 0; i < mesg.GetNumFields(); i++) {
            const fit::Field* field = mesg.GetFieldByIndex(i);
            Napi::Object fieldObj = Napi::Object::New(env);
            fieldObj.Set("name", field->GetName());

            Napi::Array valuesArray = Napi::Array::New(env);
            for (size_t j = 0; j < field->GetNumValues(); j++) {
                switch (field->GetType()) {
                    case FIT_BASE_TYPE_ENUM:
                    case FIT_BASE_TYPE_BYTE:
                    case FIT_BASE_TYPE_SINT8:
                    case FIT_BASE_TYPE_UINT8:
                    case FIT_BASE_TYPE_SINT16:
                    case FIT_BASE_TYPE_UINT16:
                    case FIT_BASE_TYPE_SINT32:
                    case FIT_BASE_TYPE_UINT32:
                    case FIT_BASE_TYPE_SINT64:
                    case FIT_BASE_TYPE_UINT64:
                    case FIT_BASE_TYPE_UINT8Z:
                    case FIT_BASE_TYPE_UINT16Z:
                    case FIT_BASE_TYPE_UINT32Z:
                    case FIT_BASE_TYPE_UINT64Z:
                    case FIT_BASE_TYPE_FLOAT32:
                    case FIT_BASE_TYPE_FLOAT64:
                        valuesArray.Set(j, Napi::Number::New(env, field->GetFLOAT64Value(j)));
                        break;
                    case FIT_BASE_TYPE_STRING: 
                    {  
                        std::wstring wideStr = field->GetSTRINGValue(j);
                        const char16_t* utf16Str = reinterpret_cast<const char16_t*>(wideStr.c_str());
                        valuesArray.Set(j, Napi::String::New(env, utf16Str));
                        break;
                    }
                    default:
                        valuesArray.Set(j, env.Undefined());
                        break;
                }
            }
            fieldObj.Set("values", valuesArray);
            fieldsArray.Set(i, fieldObj);
        }
        obj.Set("fields", fieldsArray);
        data.Set(data.Length(), obj);
    }

    void OnMesg(fit::Mesg& mesg) override {
        AddMessage(mesg);
    }

    void OnMesg(fit::FileIdMesg& mesg) override {
        Napi::Object obj = Napi::Object::New(env);
        obj.Set("type", "FileIdMesg");
        if (mesg.IsTypeValid()) obj.Set("Type", mesg.GetType());
        if (mesg.IsManufacturerValid()) obj.Set("Manufacturer", mesg.GetManufacturer());
        if (mesg.IsProductValid()) obj.Set("Product", mesg.GetProduct());
        if (mesg.IsSerialNumberValid()) obj.Set("SerialNumber", mesg.GetSerialNumber());
        if (mesg.IsNumberValid()) obj.Set("Number", mesg.GetNumber());
        data.Set(data.Length(), obj);
    }

    void OnMesg(fit::UserProfileMesg& mesg) override {
        Napi::Object obj = Napi::Object::New(env);
        obj.Set("type", "UserProfileMesg");
        if (mesg.IsFriendlyNameValid()) {
            std::wstring wideStr = mesg.GetFriendlyName();
            const char16_t* utf16Str = reinterpret_cast<const char16_t*>(wideStr.c_str());
            obj.Set("FriendlyName", utf16Str);
        }
        if (mesg.GetGender() == FIT_GENDER_MALE) obj.Set("Gender", "Male");
        if (mesg.GetGender() == FIT_GENDER_FEMALE) obj.Set("Gender", "Female");
        if (mesg.IsAgeValid()) obj.Set("Age", mesg.GetAge());
        if (mesg.IsWeightValid()) obj.Set("Weight", mesg.GetWeight());
        data.Set(data.Length(), obj);
    }

    void OnMesg(fit::MonitoringMesg& mesg) override {
        Napi::Object obj = Napi::Object::New(env);
        obj.Set("type", "MonitoringMesg");
        if (mesg.IsTimestampValid()) obj.Set("timestamp", mesg.GetTimestamp());
        if (mesg.IsActivityTypeValid()) obj.Set("ActivityType", mesg.GetActivityType());
        data.Set(data.Length(), obj);
    }

    void OnMesg(fit::DeviceInfoMesg& mesg) override {
        Napi::Object obj = Napi::Object::New(env);
        obj.Set("type", "DeviceInfoMesg");
        if (mesg.IsTimestampValid()) obj.Set("timestamp", mesg.GetTimestamp());
        if (mesg.IsSerialNumberValid()) obj.Set("SerialNumber", mesg.GetSerialNumber());
        if (mesg.IsManufacturerValid()) obj.Set("Manufacturer", mesg.GetManufacturer());
        if (mesg.IsProductValid()) obj.Set("Product", mesg.GetProduct());
        if (mesg.IsSoftwareVersionValid()) obj.Set("SoftwareVersion", mesg.GetSoftwareVersion());
        if (mesg.IsBatteryVoltageValid()) obj.Set("BatteryVoltage", mesg.GetBatteryVoltage());
        if (mesg.IsBatteryStatusValid()) obj.Set("BatteryStatus", mesg.GetBatteryStatus());
        if (mesg.IsDeviceIndexValid()) obj.Set("DeviceIndex", mesg.GetDeviceIndex());
        data.Set(data.Length(), obj);
    }

    void OnMesg(fit::RecordMesg& mesg) override {
        Napi::Object obj = Napi::Object::New(env);
        obj.Set("type", "RecordMesg");
        if (mesg.IsTimestampValid()) obj.Set("timestamp", mesg.GetTimestamp());
        if (mesg.IsPositionLatValid()) obj.Set("PositionLat", mesg.GetPositionLat());
        if (mesg.IsPositionLongValid()) obj.Set("PositionLong", mesg.GetPositionLong());
        if (mesg.IsAltitudeValid()) obj.Set("Altitude", mesg.GetAltitude());
        if (mesg.IsDistanceValid()) obj.Set("Distance", mesg.GetDistance());
        if (mesg.IsSpeedValid()) obj.Set("Speed", mesg.GetSpeed());
        if (mesg.IsHeartRateValid()) obj.Set("HeartRate", mesg.GetHeartRate());
        if (mesg.IsCadenceValid()) obj.Set("Cadence", mesg.GetCadence());
        if (mesg.IsPowerValid()) obj.Set("Power", mesg.GetPower());
        if (mesg.IsTemperatureValid()) obj.Set("Temperature", mesg.GetTemperature());
        data.Set(data.Length(), obj);
    }

    void OnDeveloperFieldDescription(const fit::DeveloperFieldDescription& desc) override {
        Napi::Object obj = Napi::Object::New(env);
        obj.Set("type", "DeveloperFieldDescription");
        obj.Set("AppVersion", desc.GetApplicationVersion());
        obj.Set("FieldNumber", desc.GetFieldDefinitionNumber());
        data.Set(data.Length(), obj);
    }
};

Napi::Array DecodeFIT(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "Path to FIT file required").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    std::string filePath = info[0].As<Napi::String>().Utf8Value();
    fit::Decode decode;
    fit::MesgBroadcaster mesgBroadcaster;
    Listener listener(env);
    std::ifstream file(filePath, std::ios::in | std::ios::binary);

    if (!file.is_open()) {
        Napi::Error::New(env, "Failed to open FIT file").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    if (!decode.IsFIT(file)) {
        Napi::Error::New(env, "File is not a valid FIT file").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    if (!decode.CheckIntegrity(file)) {
        Napi::Error::New(env, "FIT file integrity check failed").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    mesgBroadcaster.AddListener((fit::FileIdMesgListener &)listener);
    mesgBroadcaster.AddListener((fit::UserProfileMesgListener &)listener);
    mesgBroadcaster.AddListener((fit::MonitoringMesgListener &)listener);
    mesgBroadcaster.AddListener((fit::DeviceInfoMesgListener &)listener);
    mesgBroadcaster.AddListener((fit::RecordMesgListener&)listener);
    mesgBroadcaster.AddListener((fit::MesgListener &)listener);


    try {
        file.seekg(0, std::ios::beg);
        decode.Read(&file, &mesgBroadcaster, &mesgBroadcaster, &listener);
    } catch (const fit::RuntimeException& e) {
        Napi::Error::New(env, "Failed to decode FIT file").ThrowAsJavaScriptException();
    }

    return listener.data;
}

Napi::String EncodeFIT(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    return Napi::String::New(env, "Encoded data");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("decodeFIT", Napi::Function::New(env, DecodeFIT));
    exports.Set("encodeFIT", Napi::Function::New(env, EncodeFIT));
    return exports;
}


NODE_API_MODULE(fitaddon, Init)