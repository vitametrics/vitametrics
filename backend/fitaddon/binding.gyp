{
  "targets": [
    {
      "target_name": "fitaddon",
      "sources": [ 
        "FitSDK/fit_accumulated_field.cpp",
        "FitSDK/fit_accumulator.cpp",
        "FitSDK/fit_buffer_encode.cpp",
        "FitSDK/fit_buffered_mesg_broadcaster.cpp",
        "FitSDK/fit_buffered_record_mesg_broadcaster.cpp",
        "FitSDK/fit_crc.cpp",
        "FitSDK/fit_date_time.cpp",
        "FitSDK/fit_decode.cpp",
        "FitSDK/fit_developer_field_definition.cpp",
        "FitSDK/fit_developer_field_description.cpp",
        "FitSDK/fit_developer_field.cpp",
        "FitSDK/fit_encode.cpp",
        "FitSDK/fit_factory.cpp",
        "FitSDK/fit_field_base.cpp",
        "FitSDK/fit_field.cpp",
        "FitSDK/fit_field_definition.cpp",
        "FitSDK/fit_mesg_broadcaster.cpp",
        "FitSDK/fit_mesg_definition.cpp",
        "FitSDK/fit_mesg_with_event_broadcaster.cpp",
        "FitSDK/fit_mesg.cpp",
        "FitSDK/fit_profile.cpp",
        "FitSDK/fit_protocol_validator.cpp",
        "FitSDK/fit_unicode.cpp",
        "FitSDK/fit.cpp",
        "fitaddon.cpp",
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "./FitSDK"
      ],
      "conditions": [
        ['OS=="win"', {
          'msvs_settings': {
            'VCCLCompilerTool': {
              'ExceptionHandling': '1',
              'AdditionalOptions': ['/EHsc']
            }
          }
        }]
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")",
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions", "-std=c++11" ]
    }
  ]
}