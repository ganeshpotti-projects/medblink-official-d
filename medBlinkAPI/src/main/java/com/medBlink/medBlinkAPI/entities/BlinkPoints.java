package com.medBlink.medBlinkAPI.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BlinkPoints {
    private Integer currentBlinkPoints = 0;
    private Integer totalBlinkPoints = 0;
}
