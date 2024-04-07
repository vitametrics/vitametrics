/////////////////////////////////////////////////////////////////////////////////////////////
// Copyright 2024 Garmin International, Inc.
// Licensed under the Flexible and Interoperable Data Transfer (FIT) Protocol License; you
// may not use this file except in compliance with the Flexible and Interoperable Data
// Transfer (FIT) Protocol License.
/////////////////////////////////////////////////////////////////////////////////////////////
// ****WARNING****  This file is auto-generated!  Do NOT edit this file.
// Profile Version = 21.133.0Release
// Tag = production/release/21.133.0-0-g6002091
/////////////////////////////////////////////////////////////////////////////////////////////


#if !defined(FIT_DEVICE_INFO_MESG_HPP)
#define FIT_DEVICE_INFO_MESG_HPP

#include "fit_mesg.hpp"

namespace fit
{

class DeviceInfoMesg : public Mesg
{
public:
    class FieldDefNum final
    {
    public:
       static const FIT_UINT8 Timestamp = 253;
       static const FIT_UINT8 DeviceIndex = 0;
       static const FIT_UINT8 DeviceType = 1;
       static const FIT_UINT8 Manufacturer = 2;
       static const FIT_UINT8 SerialNumber = 3;
       static const FIT_UINT8 Product = 4;
       static const FIT_UINT8 SoftwareVersion = 5;
       static const FIT_UINT8 HardwareVersion = 6;
       static const FIT_UINT8 CumOperatingTime = 7;
       static const FIT_UINT8 BatteryVoltage = 10;
       static const FIT_UINT8 BatteryStatus = 11;
       static const FIT_UINT8 SensorPosition = 18;
       static const FIT_UINT8 Descriptor = 19;
       static const FIT_UINT8 AntTransmissionType = 20;
       static const FIT_UINT8 AntDeviceNumber = 21;
       static const FIT_UINT8 AntNetwork = 22;
       static const FIT_UINT8 SourceType = 25;
       static const FIT_UINT8 ProductName = 27;
       static const FIT_UINT8 BatteryLevel = 32;
       static const FIT_UINT8 Invalid = FIT_FIELD_NUM_INVALID;
    };

    DeviceInfoMesg(void) : Mesg(Profile::MESG_DEVICE_INFO)
    {
    }

    DeviceInfoMesg(const Mesg &mesg) : Mesg(mesg)
    {
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of timestamp field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsTimestampValid() const
    {
        const Field* field = GetField(253);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns timestamp field
    // Units: s
    ///////////////////////////////////////////////////////////////////////
    FIT_DATE_TIME GetTimestamp(void) const
    {
        return GetFieldUINT32Value(253, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set timestamp field
    // Units: s
    ///////////////////////////////////////////////////////////////////////
    void SetTimestamp(FIT_DATE_TIME timestamp)
    {
        SetFieldUINT32Value(253, timestamp, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of device_index field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsDeviceIndexValid() const
    {
        const Field* field = GetField(0);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns device_index field
    ///////////////////////////////////////////////////////////////////////
    FIT_DEVICE_INDEX GetDeviceIndex(void) const
    {
        return GetFieldUINT8Value(0, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set device_index field
    ///////////////////////////////////////////////////////////////////////
    void SetDeviceIndex(FIT_DEVICE_INDEX deviceIndex)
    {
        SetFieldUINT8Value(0, deviceIndex, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of device_type field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsDeviceTypeValid() const
    {
        const Field* field = GetField(1);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns device_type field
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT8 GetDeviceType(void) const
    {
        return GetFieldUINT8Value(1, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set device_type field
    ///////////////////////////////////////////////////////////////////////
    void SetDeviceType(FIT_UINT8 deviceType)
    {
        SetFieldUINT8Value(1, deviceType, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of ble_device_type field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsBleDeviceTypeValid() const
    {
        const Field* field = GetField(1);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        if( !CanSupportSubField( field, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_BLE_DEVICE_TYPE ) )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid(0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_BLE_DEVICE_TYPE);
    }


    ///////////////////////////////////////////////////////////////////////
    // Returns ble_device_type field
    ///////////////////////////////////////////////////////////////////////
    FIT_BLE_DEVICE_TYPE GetBleDeviceType(void) const
    {
        return GetFieldUINT8Value(1, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_BLE_DEVICE_TYPE);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set ble_device_type field
    ///////////////////////////////////////////////////////////////////////
    void SetBleDeviceType(FIT_BLE_DEVICE_TYPE bleDeviceType)
    {
        SetFieldUINT8Value(1, bleDeviceType, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_BLE_DEVICE_TYPE);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of antplus_device_type field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsAntplusDeviceTypeValid() const
    {
        const Field* field = GetField(1);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        if( !CanSupportSubField( field, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_ANTPLUS_DEVICE_TYPE ) )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid(0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_ANTPLUS_DEVICE_TYPE);
    }


    ///////////////////////////////////////////////////////////////////////
    // Returns antplus_device_type field
    ///////////////////////////////////////////////////////////////////////
    FIT_ANTPLUS_DEVICE_TYPE GetAntplusDeviceType(void) const
    {
        return GetFieldUINT8Value(1, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_ANTPLUS_DEVICE_TYPE);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set antplus_device_type field
    ///////////////////////////////////////////////////////////////////////
    void SetAntplusDeviceType(FIT_ANTPLUS_DEVICE_TYPE antplusDeviceType)
    {
        SetFieldUINT8Value(1, antplusDeviceType, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_ANTPLUS_DEVICE_TYPE);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of ant_device_type field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsAntDeviceTypeValid() const
    {
        const Field* field = GetField(1);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        if( !CanSupportSubField( field, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_ANT_DEVICE_TYPE ) )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid(0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_ANT_DEVICE_TYPE);
    }


    ///////////////////////////////////////////////////////////////////////
    // Returns ant_device_type field
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT8 GetAntDeviceType(void) const
    {
        return GetFieldUINT8Value(1, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_ANT_DEVICE_TYPE);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set ant_device_type field
    ///////////////////////////////////////////////////////////////////////
    void SetAntDeviceType(FIT_UINT8 antDeviceType)
    {
        SetFieldUINT8Value(1, antDeviceType, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_ANT_DEVICE_TYPE);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of local_device_type field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsLocalDeviceTypeValid() const
    {
        const Field* field = GetField(1);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        if( !CanSupportSubField( field, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_LOCAL_DEVICE_TYPE ) )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid(0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_LOCAL_DEVICE_TYPE);
    }


    ///////////////////////////////////////////////////////////////////////
    // Returns local_device_type field
    ///////////////////////////////////////////////////////////////////////
    FIT_LOCAL_DEVICE_TYPE GetLocalDeviceType(void) const
    {
        return GetFieldUINT8Value(1, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_LOCAL_DEVICE_TYPE);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set local_device_type field
    ///////////////////////////////////////////////////////////////////////
    void SetLocalDeviceType(FIT_LOCAL_DEVICE_TYPE localDeviceType)
    {
        SetFieldUINT8Value(1, localDeviceType, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_DEVICE_TYPE_FIELD_LOCAL_DEVICE_TYPE);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of manufacturer field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsManufacturerValid() const
    {
        const Field* field = GetField(2);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns manufacturer field
    ///////////////////////////////////////////////////////////////////////
    FIT_MANUFACTURER GetManufacturer(void) const
    {
        return GetFieldUINT16Value(2, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set manufacturer field
    ///////////////////////////////////////////////////////////////////////
    void SetManufacturer(FIT_MANUFACTURER manufacturer)
    {
        SetFieldUINT16Value(2, manufacturer, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of serial_number field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsSerialNumberValid() const
    {
        const Field* field = GetField(3);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns serial_number field
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT32Z GetSerialNumber(void) const
    {
        return GetFieldUINT32ZValue(3, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set serial_number field
    ///////////////////////////////////////////////////////////////////////
    void SetSerialNumber(FIT_UINT32Z serialNumber)
    {
        SetFieldUINT32ZValue(3, serialNumber, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of product field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsProductValid() const
    {
        const Field* field = GetField(4);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns product field
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT16 GetProduct(void) const
    {
        return GetFieldUINT16Value(4, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set product field
    ///////////////////////////////////////////////////////////////////////
    void SetProduct(FIT_UINT16 product)
    {
        SetFieldUINT16Value(4, product, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of favero_product field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsFaveroProductValid() const
    {
        const Field* field = GetField(4);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        if( !CanSupportSubField( field, (FIT_UINT16) Profile::DEVICE_INFO_MESG_PRODUCT_FIELD_FAVERO_PRODUCT ) )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid(0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_PRODUCT_FIELD_FAVERO_PRODUCT);
    }


    ///////////////////////////////////////////////////////////////////////
    // Returns favero_product field
    ///////////////////////////////////////////////////////////////////////
    FIT_FAVERO_PRODUCT GetFaveroProduct(void) const
    {
        return GetFieldUINT16Value(4, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_PRODUCT_FIELD_FAVERO_PRODUCT);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set favero_product field
    ///////////////////////////////////////////////////////////////////////
    void SetFaveroProduct(FIT_FAVERO_PRODUCT faveroProduct)
    {
        SetFieldUINT16Value(4, faveroProduct, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_PRODUCT_FIELD_FAVERO_PRODUCT);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of garmin_product field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsGarminProductValid() const
    {
        const Field* field = GetField(4);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        if( !CanSupportSubField( field, (FIT_UINT16) Profile::DEVICE_INFO_MESG_PRODUCT_FIELD_GARMIN_PRODUCT ) )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid(0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_PRODUCT_FIELD_GARMIN_PRODUCT);
    }


    ///////////////////////////////////////////////////////////////////////
    // Returns garmin_product field
    ///////////////////////////////////////////////////////////////////////
    FIT_GARMIN_PRODUCT GetGarminProduct(void) const
    {
        return GetFieldUINT16Value(4, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_PRODUCT_FIELD_GARMIN_PRODUCT);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set garmin_product field
    ///////////////////////////////////////////////////////////////////////
    void SetGarminProduct(FIT_GARMIN_PRODUCT garminProduct)
    {
        SetFieldUINT16Value(4, garminProduct, 0, (FIT_UINT16) Profile::DEVICE_INFO_MESG_PRODUCT_FIELD_GARMIN_PRODUCT);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of software_version field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsSoftwareVersionValid() const
    {
        const Field* field = GetField(5);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns software_version field
    ///////////////////////////////////////////////////////////////////////
    FIT_FLOAT32 GetSoftwareVersion(void) const
    {
        return GetFieldFLOAT32Value(5, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set software_version field
    ///////////////////////////////////////////////////////////////////////
    void SetSoftwareVersion(FIT_FLOAT32 softwareVersion)
    {
        SetFieldFLOAT32Value(5, softwareVersion, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of hardware_version field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsHardwareVersionValid() const
    {
        const Field* field = GetField(6);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns hardware_version field
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT8 GetHardwareVersion(void) const
    {
        return GetFieldUINT8Value(6, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set hardware_version field
    ///////////////////////////////////////////////////////////////////////
    void SetHardwareVersion(FIT_UINT8 hardwareVersion)
    {
        SetFieldUINT8Value(6, hardwareVersion, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of cum_operating_time field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsCumOperatingTimeValid() const
    {
        const Field* field = GetField(7);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns cum_operating_time field
    // Units: s
    // Comment: Reset by new battery or charge.
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT32 GetCumOperatingTime(void) const
    {
        return GetFieldUINT32Value(7, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set cum_operating_time field
    // Units: s
    // Comment: Reset by new battery or charge.
    ///////////////////////////////////////////////////////////////////////
    void SetCumOperatingTime(FIT_UINT32 cumOperatingTime)
    {
        SetFieldUINT32Value(7, cumOperatingTime, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of battery_voltage field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsBatteryVoltageValid() const
    {
        const Field* field = GetField(10);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns battery_voltage field
    // Units: V
    ///////////////////////////////////////////////////////////////////////
    FIT_FLOAT32 GetBatteryVoltage(void) const
    {
        return GetFieldFLOAT32Value(10, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set battery_voltage field
    // Units: V
    ///////////////////////////////////////////////////////////////////////
    void SetBatteryVoltage(FIT_FLOAT32 batteryVoltage)
    {
        SetFieldFLOAT32Value(10, batteryVoltage, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of battery_status field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsBatteryStatusValid() const
    {
        const Field* field = GetField(11);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns battery_status field
    ///////////////////////////////////////////////////////////////////////
    FIT_BATTERY_STATUS GetBatteryStatus(void) const
    {
        return GetFieldUINT8Value(11, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set battery_status field
    ///////////////////////////////////////////////////////////////////////
    void SetBatteryStatus(FIT_BATTERY_STATUS batteryStatus)
    {
        SetFieldUINT8Value(11, batteryStatus, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of sensor_position field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsSensorPositionValid() const
    {
        const Field* field = GetField(18);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns sensor_position field
    // Comment: Indicates the location of the sensor
    ///////////////////////////////////////////////////////////////////////
    FIT_BODY_LOCATION GetSensorPosition(void) const
    {
        return GetFieldENUMValue(18, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set sensor_position field
    // Comment: Indicates the location of the sensor
    ///////////////////////////////////////////////////////////////////////
    void SetSensorPosition(FIT_BODY_LOCATION sensorPosition)
    {
        SetFieldENUMValue(18, sensorPosition, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of descriptor field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsDescriptorValid() const
    {
        const Field* field = GetField(19);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns descriptor field
    // Comment: Used to describe the sensor or location
    ///////////////////////////////////////////////////////////////////////
    FIT_WSTRING GetDescriptor(void) const
    {
        return GetFieldSTRINGValue(19, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set descriptor field
    // Comment: Used to describe the sensor or location
    ///////////////////////////////////////////////////////////////////////
    void SetDescriptor(FIT_WSTRING descriptor)
    {
        SetFieldSTRINGValue(19, descriptor, 0);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of ant_transmission_type field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsAntTransmissionTypeValid() const
    {
        const Field* field = GetField(20);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns ant_transmission_type field
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT8Z GetAntTransmissionType(void) const
    {
        return GetFieldUINT8ZValue(20, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set ant_transmission_type field
    ///////////////////////////////////////////////////////////////////////
    void SetAntTransmissionType(FIT_UINT8Z antTransmissionType)
    {
        SetFieldUINT8ZValue(20, antTransmissionType, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of ant_device_number field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsAntDeviceNumberValid() const
    {
        const Field* field = GetField(21);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns ant_device_number field
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT16Z GetAntDeviceNumber(void) const
    {
        return GetFieldUINT16ZValue(21, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set ant_device_number field
    ///////////////////////////////////////////////////////////////////////
    void SetAntDeviceNumber(FIT_UINT16Z antDeviceNumber)
    {
        SetFieldUINT16ZValue(21, antDeviceNumber, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of ant_network field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsAntNetworkValid() const
    {
        const Field* field = GetField(22);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns ant_network field
    ///////////////////////////////////////////////////////////////////////
    FIT_ANT_NETWORK GetAntNetwork(void) const
    {
        return GetFieldENUMValue(22, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set ant_network field
    ///////////////////////////////////////////////////////////////////////
    void SetAntNetwork(FIT_ANT_NETWORK antNetwork)
    {
        SetFieldENUMValue(22, antNetwork, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of source_type field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsSourceTypeValid() const
    {
        const Field* field = GetField(25);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns source_type field
    ///////////////////////////////////////////////////////////////////////
    FIT_SOURCE_TYPE GetSourceType(void) const
    {
        return GetFieldENUMValue(25, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set source_type field
    ///////////////////////////////////////////////////////////////////////
    void SetSourceType(FIT_SOURCE_TYPE sourceType)
    {
        SetFieldENUMValue(25, sourceType, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of product_name field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsProductNameValid() const
    {
        const Field* field = GetField(27);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns product_name field
    // Comment: Optional free form string to indicate the devices name or model
    ///////////////////////////////////////////////////////////////////////
    FIT_WSTRING GetProductName(void) const
    {
        return GetFieldSTRINGValue(27, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set product_name field
    // Comment: Optional free form string to indicate the devices name or model
    ///////////////////////////////////////////////////////////////////////
    void SetProductName(FIT_WSTRING productName)
    {
        SetFieldSTRINGValue(27, productName, 0);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of battery_level field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsBatteryLevelValid() const
    {
        const Field* field = GetField(32);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns battery_level field
    // Units: %
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT8 GetBatteryLevel(void) const
    {
        return GetFieldUINT8Value(32, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set battery_level field
    // Units: %
    ///////////////////////////////////////////////////////////////////////
    void SetBatteryLevel(FIT_UINT8 batteryLevel)
    {
        SetFieldUINT8Value(32, batteryLevel, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

};

} // namespace fit

#endif // !defined(FIT_DEVICE_INFO_MESG_HPP)
