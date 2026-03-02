package com.medBlink.medBlinkAPI.controllers;

import com.medBlink.medBlinkAPI.io.PartnerRequest;
import com.medBlink.medBlinkAPI.io.PartnerResponse;
import com.medBlink.medBlinkAPI.services.PartnerService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/partners")
@AllArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    @GetMapping(value = "/getAllPartners")
    public List<PartnerResponse> getAllPartners()
    {
        return partnerService.getAllPartners();
    }

    @GetMapping(value = "/getPartner")
    public PartnerResponse getPartner()
    {
        return partnerService.getPartner();
    }

    @PostMapping(value = "/registerPartner")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody PartnerRequest request){
        partnerService.registerPartner(request);
    }

    @PatchMapping(value = "/updatePartnerStatus/{partnerID}")
    public void updatePartnerStatus(@PathVariable String partnerID, @RequestParam String partnerStatus)
    {
        partnerService.updatePartnerStatus(partnerID,partnerStatus);
    }

    @PatchMapping(value = "/updatePartner")
    public void updatePartner(@RequestBody PartnerRequest request)
    {
        partnerService.updatePartner(request);
    }

    @DeleteMapping(value="/deletePartner")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePartner()
    {
        partnerService.deletePartner();
    }
}
