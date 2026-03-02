package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.PartnerEntity;
import com.medBlink.medBlinkAPI.io.PartnerRequest;
import com.medBlink.medBlinkAPI.io.PartnerResponse;

import java.util.List;

public interface PartnerService {
    void registerPartner(PartnerRequest request);
    List<PartnerResponse> getAllPartners();
    List<PartnerEntity> getApprovedPartners(String status);
    void updatePartnerStatus(String partnerID, String partnerStatus);
    PartnerResponse getPartner();
    void updatePartner(PartnerRequest request);
    void deletePartner();
    PartnerResponse getPartnerResponse(PartnerEntity entity);
}
