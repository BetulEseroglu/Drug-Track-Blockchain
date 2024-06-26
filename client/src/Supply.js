import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';
import SupplyChainABI from './artifacts/SupplyChain.json';
import { useRawMaterialSuppliers, useManufacturers, useDistributors, useRetailers } from './AssignRoles';

function Supply() {
    const history = useHistory();
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, []);

    const [currentaccount, setCurrentaccount] = useState('');
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState({});
    const [MedStage, setMedStage] = useState({});
    const [MedicineIDs, setMedicineIDs] = useState([]);
    const [RMSID, setRMSID] = useState('');
    const [RMSMedicineID, setRMSMedicineID] = useState('');
    const [ManufacturingID, setManufacturingID] = useState('');
    const [ManufacturingMedicineID, setManufacturingMedicineID] = useState('');
    const [DistributeID, setDistributeID] = useState('');
    const [DistributeMedicineID, setDistributeMedicineID] = useState('');
    const [RetailID, setRetailID] = useState('');
    const [RetailMedicineID, setRetailMedicineID] = useState('');
    const [SoldID, setSoldID] = useState('');
    const [SoldMedicineID, setSoldMedicineID] = useState('');

    const rawMaterialSuppliers = useRawMaterialSuppliers();
    const manufacturers = useManufacturers();
    const distributors = useDistributors();
    const retailers = useRetailers();

    const medicineData = {
        Aspirin: { id: 'A278593', description: 'Pain Reliever' },
        Arvales: { id: 'A394857', description: 'Pain Reliever' },
        Parol: { id: 'P394857', description: 'Pain Reliever' },
        Augmentin: { id: 'A123456', description: 'Antibiotic' },
        Vermidon: { id: 'V654321', description: 'Pain Reliever' },
        Majezik: { id: 'M789012', description: 'Pain Reliever' },
        Dolorex: { id: 'D345678', description: 'Pain Reliever' },
        Aprol: { id: 'A456789', description: 'Pain Reliever' },
        Dikloron: { id: 'D567890', description: 'Pain Reliever' },
        Cipralex: { id: 'C678901', description: 'Antidepressant' }
    };

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
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
            const medCtr = await supplychain.methods.medicineCtr().call();
            const med = {};
            const medStage = {};
            const medicineIDs = [];
            for (let i = 0; i < medCtr; i++) {
                const medicine = await supplychain.methods.MedicineStock(i + 1).call();
                med[i] = medicine;
                medStage[i] = await supplychain.methods.showStage(i + 1).call();
                medicineIDs.push(medicine.id);
            }
            setMED(med);
            setMedStage(medStage);
            setMedicineIDs(medicineIDs);
            setloader(false);
        } else {
            window.alert('The smart contract is not deployed to current network');
        }
    };

    const redirect_to_home = () => {
        history.push('/');
    };

    const handlerChangeID = (setID, setMedicineID) => (event) => {
        const selectedID = event.target.value;
        setID(selectedID);
        const medicine = MED[selectedID - 1];
        setMedicineID(medicine ? medicine.id : '');
    };

    const handlerSubmitRMSsupply = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.RMSsupply(RMSID).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert('An error occured!!!');
        }
    };

    const handlerSubmitManufacturing = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.Manufacturing(ManufacturingID).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert('An error occured!!!');
        }
    };

    const handlerSubmitDistribute = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.Distribute(DistributeID).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert('An error occured!!!');
        }
    };

    const handlerSubmitRetail = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.Retail(RetailID).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert('An error occured!!!');
        }
    };

    const handlerSubmitSold = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.sold(SoldID).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert('An error occured!!!');
        }
    };

    if (loader) {
        return (
            <div>
                <h1 className="wait">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <span>
                    <b>Current Account Address:</b> {currentaccount}
                </span>
                <button onClick={redirect_to_home} className="btn btn-outline-danger btn-sm">
                    HOME
                </button>
            </div>

            <h6>
                <b>Supply Chain Flow:</b>
            </h6>
            <p>
                Medicine Order -&gt; Raw Material Supplier -&gt; Manufacturer -&gt; Distributor -&gt; Pharmacy -&gt; Consumer
            </p>

            <table className="table table-striped table-hover table-sm mb-4">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Medicine ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Current Processing Stage</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(MED).map(function (key, index) {
                        return (
                            <tr key={key}>
                                <td>{index + 1}</td>
                                <td>{medicineData[MED[key].name]?.id || MED[key].id}</td>
                                <td>{MED[key].name}</td>
                                <td>{MED[key].description}</td>
                                <td>{MedStage[key]}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">
                        <b>Step 1: Supply Raw Materials</b>:
                    </h5>
                    <form onSubmit={handlerSubmitRMSsupply} className="mb-4">
                        <div className="input-group mb-3">
                            <select className="form-select" onChange={handlerChangeID(setRMSID, setRMSMedicineID)} required>
                                <option value="">Select ID</option>
                                {Object.keys(MED).map((key, index) => (
                                    <option key={index} value={index + 1}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                            <input type="text" className="form-control" value={RMSMedicineID} placeholder="Medicine ID" readOnly />
                            <select className="form-select" required>
                                <option value="">Select Raw Material Supplier</option>
                                {rawMaterialSuppliers.map((supplier, index) => (
                                    <option key={index} value={supplier.id}>
                                        {supplier.name} - {supplier.place}
                                    </option>
                                ))}
                            </select>
                            <button className="btn btn-outline-success btn-sm" type="submit">
                                Supply
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">
                        <b>Step 2: Manufacture</b>:
                    </h5>
                    <form onSubmit={handlerSubmitManufacturing} className="mb-4">
                        <div className="input-group mb-3">
                            <select className="form-select" onChange={handlerChangeID(setManufacturingID, setManufacturingMedicineID)} required>
                                <option value="">Select ID</option>
                                {Object.keys(MED).map((key, index) => (
                                    <option key={index} value={index + 1}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                            <input type="text" className="form-control" value={ManufacturingMedicineID} placeholder="Medicine ID" readOnly />
                            <select className="form-select" required>
                                <option value="">Select Manufacturer</option>
                                {manufacturers.map((manufacturer, index) => (
                                    <option key={index} value={manufacturer.id}>
                                        {manufacturer.name} - {manufacturer.place}
                                    </option>
                                ))}
                            </select>
                            <button className="btn btn-outline-success btn-sm" type="submit">
                                Manufacture
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">
                        <b>Step 3: Distribute</b>:
                    </h5>
                    <form onSubmit={handlerSubmitDistribute} className="mb-4">
                        <div className="input-group mb-3">
                            <select className="form-select" onChange={handlerChangeID(setDistributeID, setDistributeMedicineID)} required>
                                <option value="">Select ID</option>
                                {Object.keys(MED).map((key, index) => (
                                    <option key={index} value={index + 1}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                            <input type="text" className="form-control" value={DistributeMedicineID} placeholder="Medicine ID" readOnly />
                            <select className="form-select" required>
                                <option value="">Select Distributor</option>
                                {distributors.map((distributor, index) => (
                                    <option key={index} value={distributor.id}>
                                        {distributor.name} - {distributor.place}
                                    </option>
                                ))}
                            </select>
                            <button className="btn btn-outline-success btn-sm" type="submit">
                                Distribute
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">
                        <b>Step 4: Pharmacy</b>:
                    </h5>
                    <form onSubmit={handlerSubmitRetail} className="mb-4">
                        <div className="input-group mb-3">
                            <select className="form-select" onChange={handlerChangeID(setRetailID, setRetailMedicineID)} required>
                                <option value="">Select ID</option>
                                {Object.keys(MED).map((key, index) => (
                                    <option key={index} value={index + 1}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                            <input type="text" className="form-control" value={RetailMedicineID} placeholder="Medicine ID" readOnly />
                            <select className="form-select" required>
                                <option value="">Select Pharmacy</option>
                                {retailers.map((retailer, index) => (
                                    <option key={index} value={retailer.id}>
                                        {retailer.name} - {retailer.place}
                                    </option>
                                ))}
                            </select>
                            <button className="btn btn-outline-success btn-sm" type="submit">
                                Retail
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">
                        <b>Step 5: Mark as sold</b>:
                    </h5>
                    <form onSubmit={handlerSubmitSold} className="mb-4">
                        <div className="input-group mb-3">
                            <select className="form-select" onChange={handlerChangeID(setSoldID, setSoldMedicineID)} required>
                                <option value="">Select ID</option>
                                {Object.keys(MED).map((key, index) => (
                                    <option key={index} value={index + 1}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                            <input type="text" className="form-control" value={SoldMedicineID} placeholder="Medicine ID" readOnly />
                            <button className="btn btn-outline-success btn-sm" type="submit">
                                Mark as sold
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Supply;