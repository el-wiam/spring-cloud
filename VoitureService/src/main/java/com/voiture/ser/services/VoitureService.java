package com.voiture.ser.services;


import com.voiture.ser.ClientService;
import com.voiture.ser.SerApplication;
import com.voiture.ser.entities.Client;
import com.voiture.ser.entities.Voiture;
import com.voiture.ser.repositories.VoitureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VoitureService {

    @Autowired
    private VoitureRepository voitureRepository;

    @Autowired
    private ClientService clientService; // Autowire the Feign client

    public Voiture saveVoiture(Voiture voiture) {
        // Call Feign client to retrieve Client details
        Client client = clientService.getClientById(voiture.getId_client());
        voiture.setClient(client); // Set the Client object in Voiture
        return voitureRepository.save(voiture); // Save Voiture
    }

    public List<Voiture> getAllVoitures() {
        List<Voiture> voitures = voitureRepository.findAll();

        // Populate the client for each voiture
        return voitures.stream()
                .map(voiture -> {
                    if (voiture.getId_client() != null) {
                        Client client = clientService.getClientById(voiture.getId_client());
                        voiture.setClient(client);
                    }
                    return voiture;
                })
                .collect(Collectors.toList());
    }

    public List<Voiture> getVoituresByClientId(Long clientId) {
        return voitureRepository.findByIdClient(clientId);
    }
}
