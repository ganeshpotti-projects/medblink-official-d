package com.medBlink.medBlinkAPI.entities;

import com.medBlink.medBlinkAPI.io.AddressDetail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
@Builder
public class UserEntity {
    @Id
    private String userID;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String userImageUrl;
    private String password;
    private List<AddressDetail> savedAddresses;
    private String phoneNumber;
    private String gender;
    private String dateOfBirth;
    private Double weight;
    private Double height;
}
