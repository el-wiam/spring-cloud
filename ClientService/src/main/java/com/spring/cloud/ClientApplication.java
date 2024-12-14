package com.spring.cloud;

import com.spring.cloud.entities.Client;
import com.spring.cloud.repositories.ClientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@EnableDiscoveryClient
@SpringBootApplication
public class ClientApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClientApplication.class, args);
	}

	@Bean
	CommandLineRunner init(ClientRepository clientRepository) {
		return args -> {
			clientRepository.save(new Client(null, "Rabab SELTIMANT", 23f));
			clientRepository.save(new Client(null, "Wiam", 23f));
			clientRepository.save(new Client(null, "Sara", 21f));
			clientRepository.save(new Client(null, "Ilham", 22f));

		};
	}
}
