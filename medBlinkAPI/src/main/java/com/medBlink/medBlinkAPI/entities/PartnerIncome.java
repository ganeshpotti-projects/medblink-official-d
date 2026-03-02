package com.medBlink.medBlinkAPI.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PartnerIncome {
    private Integer yearlyOrders=0;
    private Boolean hikeGranted=false;
    private Double yearlySalary=240000.00;
    private Integer monthlyOrders=0;
    private Double monthlySalary=20000.00;
    private Double lastMonthBonus=0.0;
}
