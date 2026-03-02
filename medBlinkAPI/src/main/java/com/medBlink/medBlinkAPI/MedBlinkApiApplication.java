package com.medBlink.medBlinkAPI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MedBlinkApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedBlinkApiApplication.class, args);
	}

}
