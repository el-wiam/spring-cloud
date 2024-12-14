package com.spring.cloud.controllers;

import com.spring.cloud.entities.Client;
import com.spring.cloud.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    // Get all clients
    @GetMapping
    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    // Get a client by ID
    @GetMapping("/{id}")
    public Client findById(@PathVariable Long id) throws Exception {
        return clientRepository.findById(id)
                .orElseThrow(() -> new Exception("Client not found"));
    }

    // Create a new client
    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientRepository.save(client);
    }

    // Update an existing client
    @PutMapping("/{id}")
    public Client updateClient(@PathVariable Long id, @RequestBody Client clientDetails) throws Exception {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new Exception("Client not found"));

        client.setNom(clientDetails.getNom());
        client.setAge(clientDetails.getAge());
        return clientRepository.save(client);
    }

    // Delete a client
    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) throws Exception {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new Exception("Client not found"));

        clientRepository.delete(client);
    }
}
