package com.medBlink.medBlinkAPI.io;

import lombok.Data;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

@Data
@SuperBuilder
@Jacksonized
public class PartnerOrderResponse extends BaseOrderResponse {
}
