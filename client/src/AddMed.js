import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import Select from 'react-select';
import SupplyChainABI from "./artifacts/SupplyChain.json";

function AddMed() {
    const history = useHistory();
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, []);

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState();
    const [MedName, setMedName] = useState("");
    const [MedDes, setMedDes] = useState("");
    const [MedStage, setMedStage] = useState();
    const [MedID, setMedID] = useState("");

    const medicineData = {
        Aspirin: { id: 'A278593', description: 'Pain Reliever' },
        Arvales: { id: 'A394857', description: 'Pain Reliever' },
        Parol: { id: 'P394857', description: 'Pain Reliever' },
        Augmentin: { id: 'B123456', description: 'Antibiotic' },
        Vermidon: { id: 'V654321', description: 'Pain Reliever' },
        Majezik: { id: 'M789012', description: 'Pain Reliever' },
        Dolorex: { id: 'D345678', description: 'Pain Reliever' },
        Aprol: { id: 'A456789', description: 'Pain Reliever' },
        Dikloron: { id: 'D567890', description: 'Pain Reliever' },
        Cipralex: { id: 'C678901', description: 'Antidepressant' }
    };

    const options = Object.keys(medicineData).map(name => ({
        value: name,
        label: name,
    }));

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    };

    const loadBlockchaindata = async () => {
        setloader(true);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setCurrentaccount(account);
        const networkId = await web3.eth.net.getId();
        const networkData = SupplyChainABI.networks[networkId];
        if (networkData) {
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
            setSupplyChain(supplychain);
            var i;
            const medCtr = await supplychain.methods.medicineCtr().call();
            const med = {};
            const medStage = [];
            for (i = 0; i < medCtr; i++) {
                med[i] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i] = await supplychain.methods.showStage(i + 1).call();
            }
            setMED(med);
            setMedStage(medStage);
            setloader(false);
        } else {
            window.alert('The smart contract is not deployed to current network');
        }
    };
    if (loader) {
        return (
            <div>
                <h1 className="wait">Loading...</h1>
            </div>
        );

    }
    const redirect_to_home = () => {
        history.push('/');
    };

    const handleChange = (selectedOption) => {
        const selectedMedName = selectedOption.value;
        setMedName(selectedMedName);
        setMedID(medicineData[selectedMedName]?.id || "");
        setMedDes(medicineData[selectedMedName]?.description || "");
    };

    const handlerSubmitMED = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.addMedicine(MedName, MedDes).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert("An error occured!!!");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <span><b>Current Account Address:</b> {currentaccount}</span>
                <button onClick={redirect_to_home} className="btn btn-outline-danger btn-sm">HOME</button>
            </div>

            <h4>Add Medicine Order:</h4>
            <form onSubmit={handlerSubmitMED} className="mb-4">
                <div className="mb-3">
                    <Select
                        value={options.find(option => option.value === MedName)}
                        onChange={handleChange}
                        options={options}
                        placeholder="Select Medicine"
                        isClearable
                    />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="text" value={MedDes} placeholder="Medicine Description" readOnly />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="text" value={MedID} placeholder="Medicine ID" readOnly />
                </div>
                <button className="btn btn-outline-success btn-sm" type="submit">Order</button>
            </form>

            <h4>Ordered Medicines:</h4>
            <table className="table table-striped table-hover table-sm mb-4">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Current Stage</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(MED).map(key => (
                        <tr key={key}>
                            <td>{medicineData[MED[key].name]?.id || MED[key].id}</td>
                            <td>{MED[key].name}</td>
                            <td>{MED[key].description}</td>
                            <td>{MedStage[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AddMed;
