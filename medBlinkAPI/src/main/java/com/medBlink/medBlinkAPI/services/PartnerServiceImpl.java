package com.medBlink.medBlinkAPI.services;

import com.medBlink.medBlinkAPI.entities.BlinkPoints;
import com.medBlink.medBlinkAPI.entities.PartnerEntity;
import com.medBlink.medBlinkAPI.entities.PartnerIncome;
import com.medBlink.medBlinkAPI.events.PartnerEvent;
import com.medBlink.medBlinkAPI.io.PartnerRequest;
import com.medBlink.medBlinkAPI.io.PartnerResponse;
import com.medBlink.medBlinkAPI.producers.EventProducer;
import com.medBlink.medBlinkAPI.repositories.PartnerRepository;
import com.medBlink.medBlinkAPI.utils.DateUtil;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class PartnerServiceImpl implements PartnerService {
    private final PartnerRepository partnerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;
    private final EventProducer eventProducer;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void registerPartner(PartnerRequest request)
    {
        PartnerEntity newPartner = convertToEntity(request);
        PartnerEntity saved = partnerRepository.save(newPartner);
        PartnerResponse response = convertToResponse(saved);

        PartnerEvent event = new PartnerEvent("REGISTERED", response);
        eventProducer.sendEvent("partner-topic", event);
    }

    @Override
    public List<PartnerResponse> getAllPartners()
    {
        List<PartnerEntity> partners = partnerRepository.findAll();
        return partners.stream().map(partner -> convertToResponse(partner)).collect(Collectors.toList());
    }

    @Override
    public PartnerResponse getPartner()
    {
        String loggedInPartnerEmail = authenticationFacade.getAuthentication().getName();
        PartnerEntity existingPartner = partnerRepository.findByEmail(loggedInPartnerEmail).orElseThrow(() -> new UsernameNotFoundException("Partner Not Found"));
        return convertToResponse(existingPartner);
    }

    @Override
    public void updatePartnerStatus(String partnerID, String partnerStatus)
    {
        PartnerEntity existingPartner = partnerRepository.findById(partnerID).orElseThrow(() -> new RuntimeException("Partner Not Found"));
        existingPartner.setStatus(partnerStatus);
        if(partnerStatus.equals("Pending") || partnerStatus.equals("Rejected"))
        {
            existingPartner.setIsApprovedPartner(false);
        }else{
            existingPartner.setIsApprovedPartner(true);
            existingPartner.setApprovedDate(LocalDateTime.now());
        }

        partnerRepository.save(existingPartner);
        sendStatusEmail(existingPartner.getEmail(), existingPartner.getName(), partnerStatus);
    }

    private void sendStatusEmail(String toEmail, String partnerName,String partnerStatus) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("MedBlink Partner Account "+partnerStatus);
        if(partnerStatus.equals("Pending"))
        {
            message.setText("Dear " + partnerName + ",\n\n"
                    + "Your MedBlink partner account is in Pending .\n"
                    + "You can't Login. Wait for Admin Approval.\n\n"
                    + "Best regards,\nMedBlink Admin Team");
        }
        else if(partnerStatus.equals("Rejected"))
        {
            message.setText("Dear " + partnerName + ",\n\n"
                    + "Sorry! Your MedBlink partner account has been rejected.\n"
                    + "You can't Login.\n\n"
                    + "Best regards,\nMedBlink Admin Team");
        }
        else {
            message.setText("Dear " + partnerName + ",\n\n"
                    + "Congratulations! Your MedBlink partner account has been approved.\n"
                    + "You can now Login and start using your dashboard.\n\n"
                    + "Best regards,\nMedBlink Admin Team");
        }

        mailSender.send(message);
    }

    @Override
    public void updatePartner(PartnerRequest request)
    {
        String loggedInPartnerEmail = authenticationFacade.getAuthentication().getName();
        PartnerEntity existingPartner = partnerRepository.findByEmail(loggedInPartnerEmail).orElseThrow(() -> new UsernameNotFoundException("Partner not found"));

        if(request.getName() != null)
        {
            existingPartner.setName(request.getName());
        }
        if(request.getPhoneNumber()!=null)
        {
            existingPartner.setPhoneNumber(request.getPhoneNumber());
        }
        if(request.getAddress()!=null)
        {
            existingPartner.setAddress(request.getAddress());
        }
        if(request.getCity()!=null)
        {
            existingPartner.setCity(request.getCity());
        }
        if(request.getZip()!=null)
        {
            existingPartner.setZip(request.getZip());
        }
        if(request.getState()!=null)
        {
            existingPartner.setState(request.getState());
        }
        if(request.getCountry()!=null)
        {
            existingPartner.setCountry(request.getCountry());
        }
        if(request.getGender()!=null)
        {
            existingPartner.setGender(request.getGender());
        }
        if(request.getDateOfBirth()!=null)
        {
            existingPartner.setDateOfBirth(request.getDateOfBirth());
        }

        partnerRepository.save(existingPartner);
    }

    @Override
    public void deletePartner()
    {
        String loggedInPartnerEmail = authenticationFacade.getAuthentication().getName();
        PartnerEntity existingPartner = partnerRepository.findByEmail(loggedInPartnerEmail).orElseThrow(() -> new UsernameNotFoundException("Partner not found"));

        partnerRepository.delete(existingPartner);
    }

    @Override
    public PartnerResponse getPartnerResponse(PartnerEntity entity)
    {
        return convertToResponse(entity);
    }

    @Override
    public List<PartnerEntity> getApprovedPartners(String status){
        List<PartnerEntity> approvedPartners = partnerRepository.findByStatus(status);
        return approvedPartners;
    }

    private PartnerEntity convertToEntity(PartnerRequest request)
    {
        return PartnerEntity.builder()
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .address(request.getAddress())
                .city(request.getCity())
                .zip(request.getZip())
                .state(request.getState())
                .country(request.getCountry())
                .status("Pending")
                .registeredDate(LocalDateTime.now())
                .approvedDate(null)
                .isApprovedPartner(false)
                .gender(null)
                .dateOfBirth(null)
                .blinkPoints(new BlinkPoints())
                .partnerIncome(new PartnerIncome())
                .build();
    }

    private PartnerResponse convertToResponse(PartnerEntity partner) {
        return PartnerResponse.builder()
                .partnerID(partner.getPartnerID())
                .name(partner.getName())
                .phoneNumber(partner.getPhoneNumber())
                .email(partner.getEmail())
                .address(partner.getAddress())
                .city(partner.getCity())
                .zip(partner.getZip())
                .state(partner.getState())
                .country(partner.getCountry())
                .status(partner.getStatus())
                .registeredDate(DateUtil.formatDateTime(partner.getRegisteredDate()))
                .approvedDate(partner.getIsApprovedPartner() ? DateUtil.formatDateTime(partner.getApprovedDate()) : null)
                .isApprovedPartner(partner.getIsApprovedPartner())
                .gender(partner.getGender())
                .dateOfBirth(partner.getDateOfBirth())
                .ordersDelivered(partner.getOrdersDelivered())
                .blinkPoints(partner.getBlinkPoints())
                .partnerIncome(partner.getPartnerIncome())
                .build();
    }
}
