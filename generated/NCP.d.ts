declare const tag: unique symbol
export type esp_ncp_status_t = number & { readonly [tag]: 'esp_ncp_status_t' };
export type esp_ncp_secur_t = number & { readonly [tag]: 'esp_ncp_secur_t' };
export type bool = number & { readonly [tag]: 'bool' };
export type uint8_t = number & { readonly [tag]: 'uint8_t' };
export type uint16_t = number & { readonly [tag]: 'uint16_t' };
export type uint32_t = number & { readonly [tag]: 'uint32_t' };
export type uint8_t_v8 = { readonly [tag]: 'uint8_t_v8' };
export type uint8_t_v16 = { readonly [tag]: 'uint8_t_v16' };
export type uint16_t_vec = { readonly [tag]: 'uint16_t_vec' };
export type uint8_t_vec = { readonly [tag]: 'uint8_t_vec' };

/** Resume network operation after a reboot
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-init| Online doc} **/
export class NETWORK_INIT {
    REQUEST(): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Start the commissioning process
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-start| Online doc} **/
export class NETWORK_START {
    /**
    * @param autostart Autostart or no-autostart
    **/
    REQUEST(autostart: bool): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Returns a value indicating whether the node is joining, joined to, or leaving a network
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-state| Online doc} **/
export class NETWORK_STATE {
    REQUEST(): void;
    /**
    * @param network_state A value indicating whether the node is joining, joined t , or leaving a network
    **/
    RESPONSE(network_state: uint8_t): void;
    NOTIFY(): void;
}

/** Notify it when the status of the stack changes
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-stack-status-handler| Online doc} **/
export class NETWORK_STACK_STATUS_HANDLER {
    REQUEST(): void;
    /**
    * @param stack_status The status of the stack changes
    **/
    RESPONSE(stack_status: uint8_t): void;
    /**
    * @param stack_status The status of the stack changes
    **/
    NOTIFY(stack_status: uint8_t): void;
}

/** Forms a new network by becoming the coordinator
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-form| Online doc} **/
export class NETWORK_FORM {
    /**
    * @param role The role of device in zigbee network
    * @param max_children_or_ed_timeout Max number of the children when coordinator or router, timeout when end device
    * @param install_code_policy Allow install code security policy or not
    * @param keep_alive Keep alive timeout in milliseconds when end device
    **/
    REQUEST(role: uint8_t, max_children_or_ed_timeout: uint8_t, install_code_policy: bool, keep_alive: uint32_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param extended_panid The IEEE address for the source
    * @param panid PAN id
    * @param channel Current channel work on|
    **/
    NOTIFY(extended_panid: uint8_t_v8, panid: uint8_t, channel: uint8_t): void;
}

/** Allow other nodes to join the network with this node as their parent
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-permit-joining| Online doc} **/
export class NETWORK_PERMIT_JOINING {
    /**
    * @param duration A value of 0x00 disables joining. A value of 0xFF enables joining. Other value enables joining for that number of seconds
    **/
    REQUEST(duration: uint8_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param duration A value of 0x00 disables joining. A value of 0xFF enables joining. Other value enables joining for that number of seconds
    **/
    NOTIFY(duration: uint8_t): void;
}

/** Associate with the network using the specified network parameters
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-join| Online doc} **/
export class NETWORK_JOIN {
    /**
    * @param role The role of device in zigbee network
    * @param install_code_policy Allow install code security policy or not
    * @param max_children_or_ed_timeout Max number of the children when coordinator or router, timeout when end device
    * @param keep_alive Keep alive timeout in milliseconds when end device
    **/
    REQUEST(role: uint8_t, install_code_policy: bool, max_children_or_ed_timeout: uint8_t, keep_alive: uint32_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param short_addr Short address of device requested to join device
    * @param ieee_addr Long address of device requested to join  device
    * @param capability Capability of device requested to join device
    **/
    NOTIFY(short_addr: uint16_t, ieee_addr: uint8_t_v8, capability: uint16_t): void;
}

/** Causes the stack to leave the current network
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-leave| Online doc} **/
export class NETWORK_LEAVE {
    REQUEST(): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param short_addr Short address of device requested to leave device
    * @param device_addr Long address of device requested to leave device
    * @param rejoin 1 if this was leave with rejoin; 0 - otherwise
    **/
    NOTIFY(short_addr: uint16_t, device_addr: uint8_t_v8, rejoin: uint16_t): void;
}

/** Active scan available network
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-start-scan| Online doc} **/
export class NETWORK_START_SCAN {
    /**
    * @param channel_mask Bits set as 1 indicate that the channel should be scanne
    * @param scan_duration Time to spend scanning each channel
    **/
    REQUEST(channel_mask: uint32_t, scan_duration: uint8_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Signals that the scan has completed
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-scan-complete-handler| Online doc} **/
export class NETWORK_SCAN_COMPLETE_HANDLER {
    REQUEST(): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param status The ZDO response status
    * @param count Number of discovered networks
    * @param short_pan_id PAN id
    * @param permit_joining Indicates that at least one router/coordinator on the network currently permits joining
    * @param extended_panid The IEEE address for the source
    **/
    NOTIFY(status: uint8_t, count: uint8_t, short_pan_id: uint16_t, permit_joining: bool, extended_panid: uint8_t_v8): void;
}

/** Terminates a scan in progress
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-stop-scan| Online doc} **/
export class NETWORK_STOP_SCAN {
    REQUEST(): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the Zigbee network PAN ID
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-pan-id-get| Online doc} **/
export class NETWORK_PAN_ID_GET {
    REQUEST(): void;
    /**
    * @param panid 16-bit Zigbee network PAN ID
    **/
    RESPONSE(panid: uint16_t): void;
    NOTIFY(): void;
}

/** Set the Zigbee network PAN ID
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-pan-id-set| Online doc} **/
export class NETWORK_PAN_ID_SET {
    /**
    * @param panid 16-bit Zigbee network PAN ID
    **/
    REQUEST(panid: uint16_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the Zigbee network extended PAN ID
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-extended-pan-id-get| Online doc} **/
export class NETWORK_EXTENDED_PAN_ID_GET {
    REQUEST(): void;
    /**
    * @param extpanid An 64-bit of extended PAN ID
    **/
    RESPONSE(extpanid: uint8_t_v8): void;
    NOTIFY(): void;
}

/** Set the Zigbee network extended PAN ID
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-extended-pan-id-set| Online doc} **/
export class NETWORK_EXTENDED_PAN_ID_SET {
    /**
    * @param extpanid An 64-bit of extended PAN ID
    **/
    REQUEST(extpanid: uint8_t_v8): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the primary channel mask
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-primary-channel-get| Online doc} **/
export class NETWORK_PRIMARY_CHANNEL_GET {
    REQUEST(): void;
    /**
    * @param channel_mask The primary channel mask
    **/
    RESPONSE(channel_mask: uint32_t): void;
    NOTIFY(): void;
}

/** Set the primary channel mask
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-primary-channel-set| Online doc} **/
export class NETWORK_PRIMARY_CHANNEL_SET {
    /**
    * @param channelmask Valid channel mask
    **/
    REQUEST(channelmask: uint32_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Set the secondary channel mask
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-secondary-channel-set| Online doc} **/
export class NETWORK_SECONDARY_CHANNEL_SET {
    /**
    * @param channelmask Valid channel mask
    **/
    REQUEST(channelmask: uint32_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the 2.4G channel
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-channel-get| Online doc} **/
export class NETWORK_CHANNEL_GET {
    REQUEST(): void;
    /**
    * @param channel The Zigbee device current channel
    **/
    RESPONSE(channel: uint8_t): void;
    NOTIFY(): void;
}

/** Set the 2.4G channel mask
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-channel-set| Online doc} **/
export class NETWORK_CHANNEL_SET {
    /**
    * @param channelmask Valid channel mask
    **/
    REQUEST(channelmask: uint32_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Set the tx power
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-txpower-set| Online doc} **/
export class NETWORK_TXPOWER_SET {
    /**
    * @param power 8-bit of power value in dB
    **/
    REQUEST(power: uint8_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the primary security network key
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-primary-key-get| Online doc} **/
export class NETWORK_PRIMARY_KEY_GET {
    REQUEST(): void;
    /**
    * @param network_key The primary security network key
    **/
    RESPONSE(network_key: uint8_t_v16): void;
    NOTIFY(): void;
}

/** Set the primary security network key
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-primary-key-set| Online doc} **/
export class NETWORK_PRIMARY_KEY_SET {
    /**
    * @param network_key The primary security network key
    **/
    REQUEST(network_key: uint8_t_v16): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the network frame counter
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-frame-count-get| Online doc} **/
export class NETWORK_FRAME_COUNT_GET {
    REQUEST(): void;
    /**
    * @param frame_counter The network frame counter
    **/
    RESPONSE(frame_counter: uint32_t): void;
    NOTIFY(): void;
}

/** Set the network frame counter
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-frame-count-set| Online doc} **/
export class NETWORK_FRAME_COUNT_SET {
    /**
    * @param frame_counter The network frame counter
    **/
    REQUEST(frame_counter: uint32_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the network role 0: Coordinator, 1: Router
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-role-get| Online doc} **/
export class NETWORK_ROLE_GET {
    REQUEST(): void;
    /**
    * @param role The network role
    **/
    RESPONSE(role: uint8_t): void;
    NOTIFY(): void;
}

/** Set the network role 0: Coordinator, 1: Router
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-role-set| Online doc} **/
export class NETWORK_ROLE_SET {
    /**
    * @param role The network role
    **/
    REQUEST(role: uint8_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the Zigbee device short address
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-short-address-get| Online doc} **/
export class NETWORK_SHORT_ADDRESS_GET {
    REQUEST(): void;
    /**
    * @param short_addr The Zigbee device short address
    **/
    RESPONSE(short_addr: uint16_t): void;
    NOTIFY(): void;
}

/** Set the Zigbee device short address
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-short-address-set| Online doc} **/
export class NETWORK_SHORT_ADDRESS_SET {
    /**
    * @param short_addr The Zigbee device short address
    **/
    REQUEST(short_addr: uint16_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the Zigbee device long address
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-long-address-get| Online doc} **/
export class NETWORK_LONG_ADDRESS_GET {
    REQUEST(): void;
    /**
    * @param long_addr The Zigbee device long address
    **/
    RESPONSE(long_addr: uint8_t_v8): void;
    NOTIFY(): void;
}

/** Set the Zigbee device long address
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-long-address-set| Online doc} **/
export class NETWORK_LONG_ADDRESS_SET {
    /**
    * @param long_addr The Zigbee device long address
    **/
    REQUEST(long_addr: uint8_t_v8): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the channel masks
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-channel-masks-get| Online doc} **/
export class NETWORK_CHANNEL_MASKS_GET {
    REQUEST(): void;
    /**
    * @param role The Zigbee device the 2.4G channel mask
    **/
    RESPONSE(role: uint32_t): void;
    NOTIFY(): void;
}

/** Set the channel masks
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-channel-masks-set| Online doc} **/
export class NETWORK_CHANNEL_MASKS_SET {
    /**
    * @param channel_mask The Zigbee device the 2.4G channel mask
    **/
    REQUEST(channel_mask: uint32_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the network update ID
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-update-id-get| Online doc} **/
export class NETWORK_UPDATE_ID_GET {
    REQUEST(): void;
    /**
    * @param nwk_update_id The network update ID
    **/
    RESPONSE(nwk_update_id: uint8_t): void;
    NOTIFY(): void;
}

/** Set the network update ID
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-update-id-set| Online doc} **/
export class NETWORK_UPDATE_ID_SET {
    /**
    * @param nwk_update_id The network update ID
    **/
    REQUEST(nwk_update_id: uint8_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the network trust center address
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-trust-center-addr-get| Online doc} **/
export class NETWORK_TRUST_CENTER_ADDR_GET {
    REQUEST(): void;
    /**
    * @param nwk_update_id The network trust center address
    **/
    RESPONSE(nwk_update_id: uint8_t_v8): void;
    NOTIFY(): void;
}

/** Set the network trust center address
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-trust-center-addr-set| Online doc} **/
export class NETWORK_TRUST_CENTER_ADDR_SET {
    /**
    * @param nwk_update_id The network trust center address
    **/
    REQUEST(nwk_update_id: uint8_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the network link key
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-link-key-get| Online doc} **/
export class NETWORK_LINK_KEY_GET {
    REQUEST(): void;
    /**
    * @param link_key The network link key
    **/
    RESPONSE(link_key: uint8_t_v16): void;
    NOTIFY(): void;
}

/** Set the network link key
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-link-key-set| Online doc} **/
export class NETWORK_LINK_KEY_SET {
    /**
    * @param link_key The network link key
    **/
    REQUEST(link_key: uint8_t_v16): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the network security mode
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-secure-mode-get| Online doc} **/
export class NETWORK_SECURE_MODE_GET {
    REQUEST(): void;
    /**
    * @param secur_mode The network security mode
    **/
    RESPONSE(secur_mode: esp_ncp_secur_t): void;
    NOTIFY(): void;
}

/** Set the network security mode
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-secure-mode-set| Online doc} **/
export class NETWORK_SECURE_MODE_SET {
    /**
    * @param secur_mode The network security mode
    **/
    REQUEST(secur_mode: esp_ncp_secur_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Enable or disable predefined network panid
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-predefined-panid| Online doc} **/
export class NETWORK_PREDEFINED_PANID {
    /**
    * @param secur_mode Enable od disable the network panid
    **/
    REQUEST(secur_mode: esp_ncp_secur_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Get the network IEEE address by the short address
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-short-to-ieee| Online doc} **/
export class NETWORK_SHORT_TO_IEEE {
    /**
    * @param short_addr The Zigbee device short address
    **/
    REQUEST(short_addr: uint16_t): void;
    /**
    * @param ieee_addr The Zigbee device long address
    **/
    RESPONSE(ieee_addr: uint8_t_v8): void;
    NOTIFY(): void;
}

/** Get the network short address by the IEEE address
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#network-ieee-to-short| Online doc} **/
export class NETWORK_IEEE_TO_SHORT {
    /**
    * @param ieee_addr The Zigbee device long address
    **/
    REQUEST(ieee_addr: uint8_t_v8): void;
    /**
    * @param short_addr The Zigbee device short address
    **/
    RESPONSE(short_addr: uint16_t): void;
    NOTIFY(): void;
}

/** Configures endpoint information on the NCP
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#zcl-endpoint-add| Online doc} **/
export class ZCL_ENDPOINT_ADD {
    /**
    * @param endpoint The application endpoint to be added
    * @param profileId The endpoint's application profile
    * @param deviceId The endpoint's device ID within the application profile
    * @param appFlags The version and flags indicate description availability
    * @param inputClusterCount The number of cluster IDs in inputClusterList
    * @param outputClusterCount The number of cluster IDs in outputClusterList
    * @param inputClusterList Input cluster IDs the endpoint will accept
    * @param outputClusterList Output cluster IDs the endpoint may send
    **/
    REQUEST(endpoint: uint8_t, profileId: uint16_t, deviceId: uint16_t, appFlags: uint8_t, inputClusterCount: uint8_t, outputClusterCount: uint8_t, inputClusterList: uint16_t_vec, outputClusterList: uint16_t_vec): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Remove endpoint information on the NCP
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#zcl-endpoint-del| Online doc} **/
export class ZCL_ENDPOINT_DEL {
    /**
    * @param endpoint The application endpoint to be added
    * @param profileId The endpoint's application profile
    * @param deviceId The endpoint's device ID within the application profile
    * @param appFlags The version and flags indicate description availability
    * @param inputClusterCount The number of cluster IDs in inputClusterList
    * @param outputClusterCount The number of cluster IDs in outputClusterList
    * @param inputClusterList Input cluster IDs the endpoint will accept
    * @param outputClusterList Output cluster IDs the endpoint may send
    **/
    REQUEST(endpoint: uint8_t, profileId: uint16_t, deviceId: uint16_t, appFlags: uint8_t, inputClusterCount: uint8_t, outputClusterCount: uint8_t, inputClusterList: uint16_t_vec, outputClusterList: uint16_t_vec): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Read attribute data on NCP endpoints
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#zcl-attr-read| Online doc} **/
export class ZCL_ATTR_READ {
    /**
    * @param dst_addr The single short address or group address
    * @param dst_endpoint Destination Endpoint ID
    * @param src_endpoint Source Endpoint ID
    * @param address_mode ZCL address mode
    * @param cluster Cluster ID
    * @param attr_number Attribute number
    * @param attributeId Attribute ID
    **/
    REQUEST(dst_addr: uint8_t_v8, dst_endpoint: uint8_t, src_endpoint: uint8_t, address_mode: uint8_t, cluster: uint16_t, attr_number: uint8_t, attributeId: uint16_t_vec): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param status Status
    * @param fc A 8-bit Frame control
    * @param manuf_code Manufacturer code
    * @param tsn Transaction sequence number
    * @param rssi Signal strength
    * @param addr_type address type see esp_zb_zcl_address_type_t
    * @param device_addr Long address of device requested to leave device
    * @param dst_address The destination short address of command
    * @param src_endpoint The source endpoint of command
    * @param dst_endpoint The destination endpoint of command
    * @param cluster The cluster id for command
    * @param profile The application profile identifier
    * @param id The command id
    * @param direction The command direction
    * @param is_common The command is common type
    * @param attr_number Attribute number
    * @param attr_status The status of the read operation on this attribute
    * @param attributeId Attribute ID
    * @param dataType Attribute data type
    * @param dataLength Attribute data length
    * @param data Attribute data
    **/
    NOTIFY(status: uint8_t, fc: uint8_t, manuf_code: uint16_t, tsn: uint8_t, rssi: uint8_t, addr_type: uint8_t, device_addr: uint8_t_v8, dst_address: uint16_t, src_endpoint: uint8_t, dst_endpoint: uint8_t, cluster: uint16_t, profile: uint16_t, id: uint8_t, direction: uint8_t, is_common: uint8_t, attr_number: uint8_t, attr_status: uint8_t, attributeId: uint16_t, dataType: uint8_t, dataLength: uint8_t, data: uint8_t_vec): void;
}

/** Write attribute data on NCP endpoints
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#zcl-attr-write| Online doc} **/
export class ZCL_ATTR_WRITE {
    /**
    * @param dst_addr The single short address or group address
    * @param dst_endpoint Destination Endpoint ID
    * @param src_endpoint Source Endpoint ID
    * @param address_mode ZCL address mode
    * @param cluster Cluster ID
    * @param attr_number Attribute number
    * @param attributeId Attribute ID
    * @param dataType Attribute data type
    * @param dataLength Attribute data length
    * @param data Attribute data
    **/
    REQUEST(dst_addr: uint8_t_v8, dst_endpoint: uint8_t, src_endpoint: uint8_t, address_mode: uint8_t, cluster: uint16_t, attr_number: uint8_t, attributeId: uint16_t, dataType: uint8_t, dataLength: uint8_t, data: uint8_t_vec): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param status Status
    * @param fc A 8-bit Frame control
    * @param manuf_code Manufacturer code
    * @param tsn Transaction sequence number
    * @param rssi Signal strength
    * @param addr_type address type see esp_zb_zcl_address_type_t
    * @param device_addr Long address of device requested to leave device
    * @param dst_address The destination short address of command
    * @param src_endpoint The source endpoint of command
    * @param dst_endpoint The destination endpoint of command
    * @param cluster The cluster id for command
    * @param profile The application profile identifier
    * @param id The command id
    * @param direction The command direction
    * @param is_common The command is common type
    * @param attr_number Attribute number
    * @param attr_status The status of the read operation on this attribute
    * @param attributeId Attribute ID
    **/
    NOTIFY(status: uint8_t, fc: uint8_t, manuf_code: uint16_t, tsn: uint8_t, rssi: uint8_t, addr_type: uint8_t, device_addr: uint8_t_v8, dst_address: uint16_t, src_endpoint: uint8_t, dst_endpoint: uint8_t, cluster: uint16_t, profile: uint16_t, id: uint8_t, direction: uint8_t, is_common: uint8_t, attr_number: uint8_t, attr_status: uint8_t, attributeId: uint16_t): void;
}

/** Report attribute data on NCP endpoints
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#zcl-attr-report| Online doc} **/
export class ZCL_ATTR_REPORT {
    /**
    * @param dst_addr The single short address or group address
    * @param dst_endpoint Destination Endpoint ID
    * @param src_endpoint Source Endpoint ID
    * @param address_mode ZCL address mode
    * @param clusterID Cluster ID to report
    * @param cluster_role Cluster role
    * @param attributeID Attribute ID to report
    **/
    REQUEST(dst_addr: uint8_t_v8, dst_endpoint: uint8_t, src_endpoint: uint8_t, address_mode: uint8_t, clusterID: uint16_t, cluster_role: uint8_t, attributeID: uint16_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param status Status
    * @param addr_type address type see esp_zb_zcl_address_type_t
    * @param device_addr Long address of device requested to leave device
    * @param src_endpoint The endpoint id which comes from report device
    * @param dst_endpoint The destination endpoint id
    * @param cluster The cluster id that reported
    * @param attr_number Attribute number
    * @param id The identify of attribute
    * @param type The type of attribute,
    * @param size The value size of attribute
    * @param data Attribute data
    **/
    NOTIFY(status: uint8_t, addr_type: uint8_t, device_addr: uint8_t_v8, src_endpoint: uint8_t, dst_endpoint: uint8_t, cluster: uint16_t, attr_number: uint8_t, id: uint16_t, type: uint8_t, size: uint8_t, data: uint8_t_vec): void;
}

/** Discover attribute data on NCP endpoints
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#zcl-attr-disc| Online doc} **/
export class ZCL_ATTR_DISC {
    /**
    * @param dst_addr The single short address or group address
    * @param dst_endpoint Destination Endpoint ID
    * @param src_endpoint Source Endpoint ID
    * @param address_mode ZCL address mode
    * @param cluster_id The cluster identifier
    * @param start_attr_id The attribute identifier to begin the discover
    * @param max_attr_number The maximum number of attribute identifiers
    * @param direction The command direction
    **/
    REQUEST(dst_addr: uint8_t_v8, dst_endpoint: uint8_t, src_endpoint: uint8_t, address_mode: uint8_t, cluster_id: uint16_t, start_attr_id: uint16_t, max_attr_number: uint8_t, direction: uint8_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param status Status
    * @param fc A 8-bit Frame control
    * @param manuf_code Manufacturer code
    * @param tsn Transaction sequence number
    * @param rssi Signal strength
    * @param addr_type address type see esp_zb_zcl_address_type_t
    * @param device_addr Long address of device requested to leave device
    * @param dst_address The destination short address of command
    * @param src_endpoint The source endpoint of command
    * @param dst_endpoint The destination endpoint of command
    * @param cluster The cluster id for command
    * @param profile The application profile identifier
    * @param id The command id
    * @param direction The command direction
    * @param is_common The command is common type
    * @param attr_number Attribute number
    * @param id2 The identify of attribute
    * @param type The type of attribute,
    **/
    NOTIFY(status: uint8_t, fc: uint8_t, manuf_code: uint16_t, tsn: uint8_t, rssi: uint8_t, addr_type: uint8_t, device_addr: uint8_t_v8, dst_address: uint16_t, src_endpoint: uint8_t, dst_endpoint: uint8_t, cluster: uint16_t, profile: uint16_t, id: uint8_t, direction: uint8_t, is_common: uint8_t, attr_number: uint8_t, id2: uint16_t, type: uint8_t): void;
}

/** Write APS on NCP endpoints
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#zcl-write| Online doc} **/
export class ZCL_WRITE {
    /**
    * @param dst_addr The single short address or group address
    * @param dst_endpoint Destination Endpoint ID
    * @param src_endpoint Source Endpoint ID
    * @param address_mode ZCL address mode
    * @param profile_id Profile id
    * @param cluster_id Cluster id
    * @param cmd_id ZCL and custom command id
    * @param direction Direction of command
    * @param dataType Command data type
    * @param dataLength Command data length
    * @param data Command data
    **/
    REQUEST(dst_addr: uint8_t_v8, dst_endpoint: uint8_t, src_endpoint: uint8_t, address_mode: uint8_t, profile_id: uint16_t, cluster_id: uint16_t, cmd_id: uint16_t, direction: uint8_t, dataType: uint8_t, dataLength: uint8_t, data: uint8_t_vec): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Report configure on NCP endpoints
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#zcl-report-config| Online doc} **/
export class ZCL_REPORT_CONFIG {
    /**
    * @param dst_addr The single short address or group address
    * @param dst_endpoint Destination Endpoint ID
    * @param src_endpoint Source Endpoint ID
    * @param address_mode ZCL address mode
    * @param cluster_id The cluster identifier
    * @param record_number The Number of report configuration record
    * @param direction The direction of the attribute are reported operation
    * @param attributeID Attribute ID to report
    * @param attrType Attribute type to Report
    * @param min_interval Minimum reporting interval
    * @param max_interval Maximum reporting interval
    **/
    REQUEST(dst_addr: uint8_t_v8, dst_endpoint: uint8_t, src_endpoint: uint8_t, address_mode: uint8_t, cluster_id: uint16_t, record_number: uint16_t, direction: uint8_t, attributeID: uint16_t, attrType: uint8_t, min_interval: uint16_t, max_interval: uint16_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param status Status
    * @param fc A 8-bit Frame control
    * @param manuf_code Manufacturer code
    * @param tsn Transaction sequence number
    * @param rssi Signal strength
    * @param addr_type address type see esp_zb_zcl_address_type_t
    * @param device_addr Long address of device requested to leave device
    * @param dst_address The destination short address of command
    * @param src_endpoint The source endpoint of command
    * @param dst_endpoint The destination endpoint of command
    * @param cluster The cluster id for command
    * @param profile The application profile identifier
    * @param id The command id
    * @param direction The command direction
    * @param is_common The command is common type
    * @param attr_number Attribute number
    * @param attr_status The status of the reported operation on this attribute
    * @param direction2 The direction of the attribute are reported operation
    * @param attributeId Attribute ID
    **/
    NOTIFY(status: uint8_t, fc: uint8_t, manuf_code: uint16_t, tsn: uint8_t, rssi: uint8_t, addr_type: uint8_t, device_addr: uint8_t_v8, dst_address: uint16_t, src_endpoint: uint8_t, dst_endpoint: uint8_t, cluster: uint16_t, profile: uint16_t, id: uint8_t, direction: uint8_t, is_common: uint8_t, attr_number: uint8_t, attr_status: uint8_t, direction2: uint8_t, attributeId: uint16_t): void;
}

/** Create a binding between two endpoints on two nodes
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#zdo-bind-set| Online doc} **/
export class ZDO_BIND_SET {
    /**
    * @param src_address The IEEE address for the source
    * @param src_endp The source endpoint for the binding entry
    * @param cluster_id The identifier of the cluster on the source device that is bound to the destination
    * @param dst_addr_mode The destination address mode
    * @param addr_short_long The destination address for the binding entry
    * @param dst_endp The destination endpoint for the binding entry
    * @param req_dst_addr Destination address of the request send to
    * @param user_cb A ZDO match desc request callback
    * @param user_ctx User information context
    **/
    REQUEST(src_address: uint8_t_v8, src_endp: uint8_t, cluster_id: uint16_t, dst_addr_mode: uint8_t, addr_short_long: uint8_t_v8, dst_endp: uint8_t, req_dst_addr: uint16_t, user_cb: uint32_t, user_ctx: uint32_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param zdo_status Status value indicating success or the reason for failur
    * @param user_cb A ZDO match desc request callback
    * @param user_ctx User information context
    **/
    NOTIFY(zdo_status: uint8_t, user_cb: uint32_t, user_ctx: uint32_t): void;
}

/** Remove a binding between two endpoints on two nodes
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#zdo-unbind-set| Online doc} **/
export class ZDO_UNBIND_SET {
    /**
    * @param src_address The IEEE address for the source
    * @param src_endp The source endpoint for the binding entry
    * @param cluster_id The identifier of the cluster on the source device that is bound to the destination
    * @param dst_addr_mode The destination address mode
    * @param addr_short_long The destination address for the binding entry
    * @param dst_endp The destination endpoint for the binding entry
    * @param req_dst_addr Destination address of the request send to
    * @param user_cb A ZDO match desc request callback
    * @param user_ctx User information context
    **/
    REQUEST(src_address: uint8_t_v8, src_endp: uint8_t, cluster_id: uint16_t, dst_addr_mode: uint8_t, addr_short_long: uint8_t_v8, dst_endp: uint8_t, req_dst_addr: uint16_t, user_cb: uint32_t, user_ctx: uint32_t): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param zdo_status Status value indicating success or the reason for failur
    * @param user_cb A ZDO match desc request callback
    * @param user_ctx User information context
    **/
    NOTIFY(zdo_status: uint8_t, user_cb: uint32_t, user_ctx: uint32_t): void;
}

/** Send match desc request to find matched Zigbee device
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#zdo-find-match| Online doc} **/
export class ZDO_FIND_MATCH {
    /**
    * @param user_cb A ZDO match desc request callback
    * @param user_ctx User information context
    * @param dst_nwk_addr NWK address that request sent to
    * @param addr_of_interest NWK address of interest
    * @param profile_id Profile ID to be match at the destination
    * @param num_in_clusters The number of input clusters for matching cluster server
    * @param num_out_clusters The number of output clusters for matching cluster client
    * @param cluster_list The cluster ID with size num_in_clusters + num_out_cluster
    **/
    REQUEST(user_cb: uint32_t, user_ctx: uint32_t, dst_nwk_addr: uint16_t, addr_of_interest: uint16_t, profile_id: uint16_t, num_in_clusters: uint8_t, num_out_clusters: uint8_t, cluster_list: uint16_t_vec): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    /**
    * @param zdo_status The ZDO response status
    * @param addr A short address of the device response
    * @param endpoint An endpoint of the device response
    * @param user_cb A ZDO match desc request callback
    * @param user_ctx User information context
    **/
    NOTIFY(zdo_status: uint8_t, addr: uint16_t, endpoint: uint8_t, user_cb: uint32_t, user_ctx: uint32_t): void;
}

/** Request the aps data
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#aps-data-request| Online doc} **/
export class APS_DATA_REQUEST {
    /**
    * @param dst_address The IEEE address for the source
    * @param dst_endpoint The number of the individual endpoint
    * @param src_endpoint The individual endpoint of the entity
    * @param dst_addr_mode The destination address mode
    * @param profile_id The profile id
    * @param cluster_id The cluster id
    * @param tx_options The transmission options for the ASDU to be transferred
    * @param use_alias Use the UseAlias parameter to request
    * @param alias_src_addr The source address to be used, If the use_alias is true
    * @param alias_seq_num The transmission options for the ASDU to be transferred
    * @param radius The distance that a transmitted frame to travel
    * @param asdu_length The number of octets comprising the ASDU being request
    * @param asdu The set of octets comprising the ASDU to be transferred
    **/
    REQUEST(dst_address: uint8_t_v8, dst_endpoint: uint8_t, src_endpoint: uint8_t, dst_addr_mode: uint8_t, profile_id: uint16_t, cluster_id: uint16_t, tx_options: uint8_t, use_alias: bool, alias_src_addr: uint8_t_v8, alias_seq_num: uint8_t, radius: uint8_t, asdu_length: uint32_t, asdu: uint8_t_vec): void;
    /**
    * @param status Status value indicating success or the reason for failure
    **/
    RESPONSE(status: esp_ncp_status_t): void;
    NOTIFY(): void;
}

/** Indication the aps data
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#aps-data-indication| Online doc} **/
export class APS_DATA_INDICATION {
    REQUEST(): void;
    /**
    * @param states The states of the device
    * @param dst_addr_mode The dest addr mode used in this primitive and of the APDU
    * @param dst_addr The individual device address or group address to directed
    * @param dst_endpoint The target endpoint on the local entity to directed
    * @param src_addr_mode The source addr mode used in this primitive and of the APD
    * @param src_addr The individual device address which the ASDU was received
    * @param src_endpoint The individual endpoint number which the ASDU was received
    * @param profile_id The identifier of the profile which this frame originated
    * @param cluster_id The identifier of the received cluster
    * @param indication_status The status of the incoming frame processing
    * @param security_status The ASDU without any security or secured with NWK key
    * @param lqi The link quality indication delivered by the NLDE
    * @param rx_time The time indication for the received packet
    * @param asdu_length The number of octets comprising the ASDU being indicated
    * @param asdu The set of octets comprising the ASDU to be indicated
    **/
    RESPONSE(states: uint8_t, dst_addr_mode: uint8_t, dst_addr: uint8_t_v8, dst_endpoint: uint8_t, src_addr_mode: uint8_t, src_addr: uint8_t_v8, src_endpoint: uint8_t, profile_id: uint16_t, cluster_id: uint16_t, indication_status: uint8_t, security_status: uint8_t, lqi: uint8_t, rx_time: uint32_t, asdu_length: uint32_t, asdu: uint8_t_vec): void;
    /**
    * @param states The states of the device
    * @param dst_addr_mode The dest addr mode used in this primitive and of the APDU
    * @param dst_addr The individual device address or group address to directed
    * @param dst_endpoint The target endpoint on the local entity to directed
    * @param src_addr_mode The source addr mode used in this primitive and of the APD
    * @param src_addr The individual device address which the ASDU was received
    * @param src_endpoint The individual endpoint number which the ASDU was received
    * @param profile_id The identifier of the profile which this frame originated
    * @param cluster_id The identifier of the received cluster
    * @param indication_status The status of the incoming frame processing
    * @param security_status The ASDU without any security or secured with NWK key
    * @param lqi The link quality indication delivered by the NLDE
    * @param rx_time The time indication for the received packet
    * @param asdu_length The number of octets comprising the ASDU being indicated
    * @param asdu The set of octets comprising the ASDU to be indicated
    **/
    NOTIFY(states: uint8_t, dst_addr_mode: uint8_t, dst_addr: uint8_t_v8, dst_endpoint: uint8_t, src_addr_mode: uint8_t, src_addr: uint8_t_v8, src_endpoint: uint8_t, profile_id: uint16_t, cluster_id: uint16_t, indication_status: uint8_t, security_status: uint8_t, lqi: uint8_t, rx_time: uint32_t, asdu_length: uint32_t, asdu: uint8_t_vec): void;
}

/** Confirm the aps data
    @see {@link https://docs.espressif.com/projects/esp-zigbee-sdk/en/latest/esp32/user-guide/ncp.html#aps-data-confirm| Online doc} **/
export class APS_DATA_CONFIRM {
    REQUEST(): void;
    /**
    * @param states The states of the device
    * @param dst_addr_mode The dest addr mode used in this primitive and of the APDU
    * @param dst_address The IEEE address for the dest
    * @param dst_endpoint The individual endpoint of the dest
    * @param src_endpoint The individual endpoint of the source
    * @param tx_time The time confirm for the transferred packet
    * @param confirm_status The status of data confirm
    * @param asdu_length The number of octets comprising the ASDU being confirmed
    * @param asdu The set of octets comprising the ASDU to be confirm
    **/
    RESPONSE(states: uint8_t, dst_addr_mode: uint8_t, dst_address: uint8_t_v8, dst_endpoint: uint8_t, src_endpoint: uint8_t, tx_time: uint32_t, confirm_status: uint8_t, asdu_length: uint32_t, asdu: uint8_t_vec): void;
    /**
    * @param states The states of the device
    * @param dst_addr_mode The dest addr mode used in this primitive and of the APDU
    * @param dst_address The IEEE address for the dest
    * @param dst_endpoint The individual endpoint of the dest
    * @param src_endpoint The individual endpoint of the source
    * @param tx_time The time confirm for the transferred packet
    * @param confirm_status The status of data confirm
    * @param asdu_length The number of octets comprising the ASDU being confirmed
    * @param asdu The set of octets comprising the ASDU to be confirm
    **/
    NOTIFY(states: uint8_t, dst_addr_mode: uint8_t, dst_address: uint8_t_v8, dst_endpoint: uint8_t, src_endpoint: uint8_t, tx_time: uint32_t, confirm_status: uint8_t, asdu_length: uint32_t, asdu: uint8_t_vec): void;
}
