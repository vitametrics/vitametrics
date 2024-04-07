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


#if !defined(FIT_WEATHER_ALERT_MESG_HPP)
#define FIT_WEATHER_ALERT_MESG_HPP

#include "fit_mesg.hpp"

namespace fit
{

class WeatherAlertMesg : public Mesg
{
public:
    class FieldDefNum final
    {
    public:
       static const FIT_UINT8 Timestamp = 253;
       static const FIT_UINT8 ReportId = 0;
       static const FIT_UINT8 IssueTime = 1;
       static const FIT_UINT8 ExpireTime = 2;
       static const FIT_UINT8 Severity = 3;
       static const FIT_UINT8 Type = 4;
       static const FIT_UINT8 Invalid = FIT_FIELD_NUM_INVALID;
    };

    WeatherAlertMesg(void) : Mesg(Profile::MESG_WEATHER_ALERT)
    {
    }

    WeatherAlertMesg(const Mesg &mesg) : Mesg(mesg)
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
    ///////////////////////////////////////////////////////////////////////
    FIT_DATE_TIME GetTimestamp(void) const
    {
        return GetFieldUINT32Value(253, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set timestamp field
    ///////////////////////////////////////////////////////////////////////
    void SetTimestamp(FIT_DATE_TIME timestamp)
    {
        SetFieldUINT32Value(253, timestamp, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of report_id field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsReportIdValid() const
    {
        const Field* field = GetField(0);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns report_id field
    // Comment: Unique identifier from GCS report ID string, length is 12
    ///////////////////////////////////////////////////////////////////////
    FIT_WSTRING GetReportId(void) const
    {
        return GetFieldSTRINGValue(0, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set report_id field
    // Comment: Unique identifier from GCS report ID string, length is 12
    ///////////////////////////////////////////////////////////////////////
    void SetReportId(FIT_WSTRING reportId)
    {
        SetFieldSTRINGValue(0, reportId, 0);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of issue_time field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsIssueTimeValid() const
    {
        const Field* field = GetField(1);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns issue_time field
    // Comment: Time alert was issued
    ///////////////////////////////////////////////////////////////////////
    FIT_DATE_TIME GetIssueTime(void) const
    {
        return GetFieldUINT32Value(1, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set issue_time field
    // Comment: Time alert was issued
    ///////////////////////////////////////////////////////////////////////
    void SetIssueTime(FIT_DATE_TIME issueTime)
    {
        SetFieldUINT32Value(1, issueTime, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of expire_time field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsExpireTimeValid() const
    {
        const Field* field = GetField(2);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns expire_time field
    // Comment: Time alert expires
    ///////////////////////////////////////////////////////////////////////
    FIT_DATE_TIME GetExpireTime(void) const
    {
        return GetFieldUINT32Value(2, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set expire_time field
    // Comment: Time alert expires
    ///////////////////////////////////////////////////////////////////////
    void SetExpireTime(FIT_DATE_TIME expireTime)
    {
        SetFieldUINT32Value(2, expireTime, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of severity field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsSeverityValid() const
    {
        const Field* field = GetField(3);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns severity field
    // Comment: Warning, Watch, Advisory, Statement
    ///////////////////////////////////////////////////////////////////////
    FIT_WEATHER_SEVERITY GetSeverity(void) const
    {
        return GetFieldENUMValue(3, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set severity field
    // Comment: Warning, Watch, Advisory, Statement
    ///////////////////////////////////////////////////////////////////////
    void SetSeverity(FIT_WEATHER_SEVERITY severity)
    {
        SetFieldENUMValue(3, severity, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of type field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsTypeValid() const
    {
        const Field* field = GetField(4);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns type field
    // Comment: Tornado, Severe Thunderstorm, etc.
    ///////////////////////////////////////////////////////////////////////
    FIT_WEATHER_SEVERE_TYPE GetType(void) const
    {
        return GetFieldENUMValue(4, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set type field
    // Comment: Tornado, Severe Thunderstorm, etc.
    ///////////////////////////////////////////////////////////////////////
    void SetType(FIT_WEATHER_SEVERE_TYPE type)
    {
        SetFieldENUMValue(4, type, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

};

} // namespace fit

#endif // !defined(FIT_WEATHER_ALERT_MESG_HPP)