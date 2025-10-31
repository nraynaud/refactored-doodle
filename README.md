# A simple node.js connector for ESP32 Zigbee NCP

this is just a draft as of Nov 2025.

The IP is not clean since a lot of files are downloaded.

The device might need to use this [PR fixing the SLIP framing](https://github.com/espressif/esp-zigbee-sdk/pull/736).
The Serial library I use doesn't expose `tcsendbreak()` to JS.
