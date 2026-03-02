package com.medBlink.medBlinkAPI.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderFeedback {
    private Integer orderRating;
    private String orderReview;
    private Integer partnerRating;
    private String partnerReview;
}
