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


#if !defined(FIELD_BASE_HPP)
#define FIELD_BASE_HPP

#include <cstdio>
#include <iosfwd>
#include <string>
#include <vector>
#include "fit.hpp"
#include "fit_profile.hpp"

namespace fit
{

class FieldBase
{
public:
    FieldBase(void);
    FieldBase(const FieldBase& other);
    virtual ~FieldBase();

    std::string GetName(const FIT_UINT16 subFieldIndex) const;
    FIT_UINT8 GetType(const FIT_UINT16 subFieldIndex) const;
    std::string GetUnits(const FIT_UINT16 subFieldIndex) const;
    FIT_FLOAT64 GetScale(const FIT_UINT16 subFieldIndex) const;
    FIT_FLOAT64 GetOffset(const FIT_UINT16 subFieldIndex) const;

    virtual FIT_BOOL GetIsAccumulated() const = 0;
    virtual FIT_BOOL IsValid(void) const = 0;
    virtual FIT_UINT8 GetNum(void) const = 0;
    virtual std::string GetName() const = 0;
    virtual FIT_UINT8 GetType() const = 0;
    virtual std::string GetUnits() const = 0;
    virtual FIT_FLOAT64 GetScale() const = 0;
    virtual FIT_FLOAT64 GetOffset() const = 0;
    virtual const Profile::SUBFIELD* GetSubField(const FIT_UINT16 subFieldIndex) const = 0;
    virtual FIT_UINT16 GetNumSubFields(void) const = 0;
    virtual const Profile::FIELD_COMPONENT* GetComponent(const FIT_UINT16 component) const = 0;
    virtual FIT_UINT16 GetNumComponents(void) const = 0;

    FIT_BOOL IsSignedInteger(const FIT_UINT16 subFieldIndex = 0) const;
    FIT_UINT8 GetSize(void) const;
    FIT_UINT8 GetNumValues(void) const;

    FIT_UINT32 GetBitsValue(const FIT_UINT16 offset, const FIT_UINT8 bits) const;
    FIT_SINT32 GetBitsSignedValue(const FIT_UINT16 offset, const FIT_UINT8 bits) const;
    FIT_BYTE GetValuesBYTE(const FIT_UINT8 index) const;
    FIT_SINT8 GetValuesSINT8(const FIT_UINT8 index) const;
    FIT_UINT8 GetValuesUINT8(const FIT_UINT8 index) const;
    FIT_FLOAT32 GetFLOAT32Value(const FIT_UINT8 fieldArrayIndex = 0, const FIT_UINT16 subFieldIndex = FIT_SUBFIELD_INDEX_MAIN_FIELD) const;
    FIT_FLOAT64 GetFLOAT64Value(const FIT_UINT8 fieldArrayIndex = 0, const FIT_UINT16 subFieldIndex = FIT_SUBFIELD_INDEX_MAIN_FIELD) const;
    FIT_WSTRING GetSTRINGValue(const FIT_UINT8 fieldArrayIndex = 0, const FIT_UINT16 subFieldIndex = FIT_SUBFIELD_INDEX_MAIN_FIELD) const;
    FIT_FLOAT64 GetRawValue() const;
    FIT_FLOAT64 GetRawValue(const FIT_UINT8 fieldArrayIndex) const;
    FIT_ENUM GetENUMValue(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_BYTE GetBYTEValue(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_SINT8 GetSINT8Value(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_UINT8 GetUINT8Value(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_UINT8Z GetUINT8ZValue(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_SINT16 GetSINT16Value(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_UINT16 GetUINT16Value(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_UINT16Z GetUINT16ZValue(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_SINT32 GetSINT32Value(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_UINT32 GetUINT32Value(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_UINT32Z GetUINT32ZValue(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_SINT64 GetSINT64Value(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_UINT64 GetUINT64Value(const FIT_UINT8 fieldArrayIndex = 0) const;
    FIT_UINT64Z GetUINT64ZValue(const FIT_UINT8 fieldArrayIndex = 0) const;

    void AddRawValue(const FIT_FLOAT64 rawValue, const FIT_UINT8 fieldArrayIndex = 0);
    void SetENUMValue(const FIT_ENUM value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetBYTEValue(const FIT_BYTE value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetSINT8Value(const FIT_SINT8 value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetUINT8Value(const FIT_UINT8 value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetUINT8ZValue(const FIT_UINT8 value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetSINT16Value(const FIT_SINT16 value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetUINT16Value(const FIT_UINT16 value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetUINT16ZValue(const FIT_UINT16Z value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetSINT32Value(const FIT_SINT32 value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetUINT32Value(const FIT_UINT32 value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetUINT32ZValue(const FIT_UINT32Z value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetSINT64Value(const FIT_SINT64 value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetUINT64Value(const FIT_UINT64 value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetUINT64ZValue(const FIT_UINT64Z value, const FIT_UINT8 fieldArrayIndex = 0);
    void SetFLOAT32Value(const FIT_FLOAT32 value, const FIT_UINT8 fieldArrayIndex = 0, const FIT_UINT16 subFieldIndex = FIT_SUBFIELD_INDEX_MAIN_FIELD);
    void SetFLOAT64Value(const FIT_FLOAT64 value, const FIT_UINT8 fieldArrayIndex = 0, const FIT_UINT16 subFieldIndex = FIT_SUBFIELD_INDEX_MAIN_FIELD);
    void SetSTRINGValue(const FIT_WSTRING& value, const FIT_UINT8 fieldArrayIndex = 0);
    void AddValue(const FIT_FLOAT64 value, const FIT_UINT8 fieldArrayIndex = 0, const FIT_UINT16 subFieldIndex = FIT_SUBFIELD_INDEX_MAIN_FIELD);

    FIT_BOOL Read(const void *data, const FIT_UINT8 size);
    FIT_UINT8 Write(std::ostream &file) const;
    FIT_BOOL IsValueValid(const FIT_UINT8 fieldArrayIndex = 0, const FIT_UINT16 subfieldIndex = FIT_SUBFIELD_INDEX_MAIN_FIELD) const;

protected:
    FIT_UINT16 GetSubField(const std::string& subFieldName) const;

private:
    template<typename T>
    T GetValue(const FIT_UINT8 fieldArrayIndex) const;

    template<typename TTo, typename TFrom>
    TTo ConvertBaseType(const FIT_UINT8 fieldArrayIndex, const FIT_UINT8 toBaseType) const;

    FIT_BOOL GetMemoryValue(const FIT_UINT8 fieldArrayIndex, FIT_UINT8 * buffer, const FIT_UINT8 bufferSize) const;

    FIT_FLOAT64 GetRawValueInternal(const FIT_UINT8 fieldArrayIndex = 0) const;
    static FIT_FLOAT64 Round(FIT_FLOAT64 value);

    std::vector<FIT_BYTE> values;
    std::vector<FIT_UINT8> stringIndexes;
};

} // namespace fit

#endif // defined(FIELD_BASE_HPP)
