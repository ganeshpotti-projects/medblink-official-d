package com.medBlink.medBlinkAPI.schedulers;

import com.medBlink.medBlinkAPI.entities.PartnerEntity;
import com.medBlink.medBlinkAPI.entities.PartnerIncome;
import com.medBlink.medBlinkAPI.repositories.PartnerRepository;
import com.medBlink.medBlinkAPI.services.PartnerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
public class PartnerIncomeScheduler {

    @Autowired
    private PartnerService partnerService;

    @Autowired
    private PartnerRepository partnerRepository;

    @Scheduled(cron = "0 0 0 28 * *")
    public void calculateMonthlyBonus() {
        List<PartnerEntity> approvedPartners = partnerService.getApprovedPartners("APPROVED");

        for (PartnerEntity partner : approvedPartners) {
            PartnerIncome income = partner.getPartnerIncome();
            int monthlyOrders = income.getMonthlyOrders();
            if (monthlyOrders >= 200) {
                income.setLastMonthBonus(200.0);
            } else {
                income.setLastMonthBonus(0.0);
            }
            income.setMonthlyOrders(0);
            partner.setPartnerIncome(income);
            partnerRepository.save(partner);
        }
    }

    @Scheduled(cron = "0 0 0 1 1 *")
    public void calculateYearlyHike() {
        List<PartnerEntity> approvedPartners = partnerService.getApprovedPartners("APPROVED");
        LocalDate today = LocalDate.now();

        for (PartnerEntity partner : approvedPartners) {
            PartnerIncome income = partner.getPartnerIncome();
            long monthsOfExp = ChronoUnit.MONTHS.between(partner.getApprovedDate().toLocalDate(), today);
            int yearlyOrders = income.getYearlyOrders();
            int expectedOrders = (int) (monthsOfExp * 200);

            if (yearlyOrders >= expectedOrders) {
                double currentMonthlySalary = income.getMonthlySalary();
                double newMonthlySalary = currentMonthlySalary * 1.07;
                income.setMonthlySalary(newMonthlySalary);
                income.setYearlySalary(newMonthlySalary * 12);
                income.setHikeGranted(true);
            } else {
                income.setHikeGranted(false);
            }

            income.setYearlyOrders(0);
            partner.setPartnerIncome(income);
            partnerRepository.save(partner);
        }
    }
}
