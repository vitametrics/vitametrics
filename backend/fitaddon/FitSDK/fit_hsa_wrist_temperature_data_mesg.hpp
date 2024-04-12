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


#if !defined(FIT_HSA_WRIST_TEMPERATURE_DATA_MESG_HPP)
#define FIT_HSA_WRIST_TEMPERATURE_DATA_MESG_HPP

#include "fit_mesg.hpp"

namespace fit
{

class HsaWristTemperatureDataMesg : public Mesg
{
public:
    class FieldDefNum final
    {
    public:
       static const FIT_UINT8 Timestamp = 253;
       static const FIT_UINT8 ProcessingInterval = 0;
       static const FIT_UINT8 Value = 1;
       static const FIT_UINT8 Invalid = FIT_FIELD_NUM_INVALID;
    };

    HsaWristTemperatureDataMesg(void) : Mesg(Profile::MESG_HSA_WRIST_TEMPERATURE_DATA)
    {
    }

    HsaWristTemperatureDataMesg(const Mesg &mesg) : Mesg(mesg)
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
    // Checks the validity of processing_interval field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsProcessingIntervalValid() const
    {
        const Field* field = GetField(0);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns processing_interval field
    // Units: s
    // Comment: Processing interval length in seconds
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT16 GetProcessingInterval(void) const
    {
        return GetFieldUINT16Value(0, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set processing_interval field
    // Units: s
    // Comment: Processing interval length in seconds
    ///////////////////////////////////////////////////////////////////////
    void SetProcessingInterval(FIT_UINT16 processingInterval)
    {
        SetFieldUINT16Value(0, processingInterval, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns number of value
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT8 GetNumValue(void) const
    {
        return GetFieldNumValues(1, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of value field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsValueValid(FIT_UINT8 index) const
    {
        const Field* field = GetField(1);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid(index);
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns value field
    // Units: degC
    // Comment: Wrist temperature reading
    ///////////////////////////////////////////////////////////////////////
    FIT_FLOAT32 GetValue(FIT_UINT8 index) const
    {
        return GetFieldFLOAT32Value(1, index, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set value field
    // Units: degC
    // Comment: Wrist temperature reading
    ///////////////////////////////////////////////////////////////////////
    void SetValue(FIT_UINT8 index, FIT_FLOAT32 value)
    {
        SetFieldFLOAT32Value(1, value, index, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

};

} // namespace fit

#endif // !defined(FIT_HSA_WRIST_TEMPERATURE_DATA_MESG_HPP)
