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


#if !defined(FIT_ENCODE_HPP)
#define FIT_ENCODE_HPP

#include <iosfwd>
#include <vector>
#include "fit.hpp"
#include "fit_mesg.hpp"
#include "fit_mesg_definition.hpp"
#include "fit_mesg_definition_listener.hpp"
#include "fit_mesg_listener.hpp"
#include "fit_protocol_validator.hpp"

namespace fit
{

class Encode
    : public MesgListener
    , public MesgDefinitionListener
{
public:
    DEPRECATED
        (
        "Encode now supports multiple protocol version encoding use: "
        "Encode::Encode(fit::ProtocolVersion) to ensure features "
        "are correctly validated"
        )
    Encode(void);
    Encode( ProtocolVersion version );

    void Open(std::iostream& file);
    void Write(const MesgDefinition& mesgDef);
    void Write(const Mesg& mesg);
    void Write(const std::vector<Mesg>& mesgs);
    FIT_BOOL Close(void);
    void OnMesg(Mesg& mesg);
    void OnMesgDefinition(MesgDefinition& mesgDef);

private:
    void WriteFileHeader();

    MesgDefinition lastMesgDefinition[FIT_MAX_LOCAL_MESGS];
    FIT_UINT32 dataSize;
    std::iostream *file;

    ProtocolVersion version;
    ProtocolValidator validator;
};

} // namespace fit

#endif // defined(FIT_ENCODE_HPP)