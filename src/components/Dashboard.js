import React, { useState, useEffect } from "react";
import {
    getClients,
    getVoitures,
    addClient,
    addVoiture,
    getVoituresByClientId,
    deleteClient,
    deleteVoiture,
    updateClient,
    updateVoiture
} from "../apiservices/api.js";
import { Modal, Button, Form, Table, Card, Row, Col, Container } from "react-bootstrap";
import "./style.css";

function Dashboard() {
    const [clients, setClients] = useState([]);
    const [voitures, setVoitures] = useState([]);
    const [filteredVoitures, setFilteredVoitures] = useState([]);
    const [searchClientName, setSearchClientName] = useState("");

    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedVoitureId, setSelectedVoitureId] = useState(null);

    const [showClientModal, setShowClientModal] = useState(false);
    const [showVoitureModal, setShowVoitureModal] = useState(false);

    const [newClient, setNewClient] = useState({ nom: "", age: "" });
    const [newVoiture, setNewVoiture] = useState({
        marque: "",
        matricule: "",
        model: "",
    });

    const [isEditingClient, setIsEditingClient] = useState(false);
    const [isEditingVoiture, setIsEditingVoiture] = useState(false);

    useEffect(() => {
        fetchClients();
        fetchVoitures();
    }, []);

    const fetchClients = async () => {
        const response = await getClients();
        setClients(response.data);
    };

    const fetchVoitures = async () => {
        const response = await getVoitures();
        setVoitures(response.data);
    };

    const handleAddOrUpdateClient = async () => {
        if (isEditingClient) {
            await updateClient(selectedClientId, newClient);
        } else {
            await addClient(newClient);
        }
        setNewClient({ nom: "", age: "" });
        fetchClients();
        setShowClientModal(false);
        setIsEditingClient(false);
    };

    const handleAddOrUpdateVoiture = async () => {
        if (isEditingVoiture) {
            await updateVoiture(selectedVoitureId, newVoiture);
        } else {
            await addVoiture(selectedClientId, newVoiture);
        }
        setNewVoiture({ marque: "", matricule: "", model: "" });
        fetchVoitures();
        setShowVoitureModal(false);
        setIsEditingVoiture(false);
    };

    const handleSearchVoituresByClientName = () => {
        const client = clients.find((c) =>
            c.nom.toLowerCase().includes(searchClientName.toLowerCase())
        );
        if (client) {
            setSelectedClientId(client.id);
            handleSearchVoituresByClient(client.id);
        } else {
            setFilteredVoitures([]);
        }
    };

    const handleSearchVoituresByClient = async (clientId) => {
        const response = await getVoituresByClientId(clientId);
        setFilteredVoitures(response.data);
    };

    const handleDeleteClient = async (id) => {
        await deleteClient(id);
        fetchClients();
    };

    const handleDeleteVoiture = async (id) => {
        await deleteVoiture(id);
        fetchVoitures();
    };

    const openEditClientModal = (client) => {
        setNewClient({ nom: client.nom, age: client.age });
        setSelectedClientId(client.id);
        setIsEditingClient(true);
        setShowClientModal(true);
    };

    const openEditVoitureModal = (voiture) => {
        setNewVoiture({
            marque: voiture.marque,
            matricule: voiture.matricule,
            model: voiture.model,
        });
        setSelectedVoitureId(voiture.id);
        setIsEditingVoiture(true);
        setShowVoitureModal(true);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center text-primary mb-4">client and cars management</h1>
            {/* Search Section */}
            <div className="card">
                <div className="card-header bg-info text-white">
                    <h4>Search Cars by Client Name</h4>
                </div>
                <div className="card-body">
                    <input
                        type="text"
                        placeholder="Enter client name"
                        value={searchClientName}
                        onChange={(e) => setSearchClientName(e.target.value)}
                        className="form-control mb-3"
                    />
                    <button
                        className="btn btn-info mb-3"
                        onClick={handleSearchVoituresByClientName}
                    >
                        Search
                    </button>
                    <ul>
                        {filteredVoitures.map((voiture) => (
                            <li key={voiture.id} className="list-item">
                                {voiture.marque} - {voiture.model} ({voiture.matricule})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Row for Clients and Voitures */}
            <div className="row mb-4">
                {/* Clients Section */}
                <div className="card">
                    <div className="card-header bg-primary text-white">
                        <h4>Clients</h4>
                    </div>
                    <div className="card-body">
                        <table className="table striped bordered hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client) => (
                                    <tr key={client.id}>
                                        <td>{client.nom}</td>
                                        <td>{client.age}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => openEditClientModal(client)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteClient(client.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setShowClientModal(true);
                                setIsEditingClient(false);
                                setNewClient({ nom: "", age: "" });
                            }}
                        >
                            Add Client
                        </button>
                    </div>
                </div>

                {/* Voitures Section */}
                <div className="card">
                    <div className="card-header bg-success text-white">
                        <h4>Cars</h4>
                    </div>
                    <div className="card-body">
                        <table className="table striped bordered hover">
                            <thead>
                                <tr>
                                    <th>Marque</th>
                                    <th>Matricule</th>
                                    <th>Model</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voitures.map((voiture) => (
                                    <tr key={voiture.id}>
                                        <td>{voiture.marque}</td>
                                        <td>{voiture.matricule}</td>
                                        <td>{voiture.model}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => openEditVoitureModal(voiture)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteVoiture(voiture.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            className="btn btn-success"
                            onClick={() => {
                                setShowVoitureModal(true);
                                setIsEditingVoiture(false);
                                setNewVoiture({ marque: "", matricule: "", model: "" });
                            }}
                        >
                            Add Voiture
                        </button>
                    </div>
                </div>
            </div>
            {/* Modals */}
            {/* Client Modal */}
            <Modal show={showClientModal} onHide={() => setShowClientModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingClient ? "Edit Client" : "Add Client"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={newClient.nom}
                                onChange={(e) =>
                                    setNewClient({ ...newClient, nom: e.target.value })
                                }
                                className="form-control"
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label>Age</label>
                            <input
                                type="number"
                                placeholder="Enter age"
                                value={newClient.age}
                                onChange={(e) =>
                                    setNewClient({ ...newClient, age: e.target.value })
                                }
                                className="form-control"
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowClientModal(false)}>
                        Close
                    </button>
                    <button className="btn btn-primary" onClick={handleAddOrUpdateClient}>
                        {isEditingClient ? "Save Changes" : "Add Client"}
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Voiture Modal */}
            <Modal show={showVoitureModal} onHide={() => setShowVoitureModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingVoiture ? "Edit Voiture" : "Add Voiture"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>Marque</label>
                            <input
                                type="text"
                                placeholder="Enter marque"
                                value={newVoiture.marque}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, marque: e.target.value })
                                }
                                className="form-control"
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label>Matricule</label>
                            <input
                                type="text"
                                placeholder="Enter matricule"
                                value={newVoiture.matricule}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, matricule: e.target.value })
                                }
                                className="form-control"
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label>Model</label>
                            <input
                                type="text"
                                placeholder="Enter model"
                                value={newVoiture.model}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, model: e.target.value })
                                }
                                className="form-control"
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Select Client</label>
                            <select
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                value={selectedClientId}
                                className="form-control"
                            >
                                <option value="">Select Client</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowVoitureModal(false)}>
                        Close
                    </button>
                    <button className="btn btn-success" onClick={handleAddOrUpdateVoiture}>
                        {isEditingVoiture ? "Save Changes" : "Add Voiture"}
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}

export default Dashboard;
