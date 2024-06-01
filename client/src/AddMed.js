import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';
import SupplyChainABI from './artifacts/SupplyChain.json';
import { useRetailers } from './AssignRoles'; // Perakendeci bilgilerini çekmek için import ediyoruz
import { useManufacturers } from './AssignRoles';

function AddMed() {
    const history = useHistory();
    const retailers = useRetailers(); // Perakendeci bilgilerini çekiyoruz
    const [selectedRetailer, setSelectedRetailer] = useState(null);

    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, []);

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState({});
    const [MedStage, setMedStage] = useState([]);
    const [MedName, setMedName] = useState("");
    const [MedDes, setMedDes] = useState("");
    const [MedID, setMedID] = useState("");
    const [orderQuantity, setOrderQuantity] = useState(""); // Sipariş adeti için state
    const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı için state
    const manufacturers = useManufacturers();

    const [filterName, setFilterName] = useState("");
    const [filterDescription, setFilterDescription] = useState("");
    const [filterStage, setFilterStage] = useState("");
    const [filterID, setFilterID] = useState("");
    const [filterRetailer, setFilterRetailer] = useState(""); // Perakendeci filtresi için state
    const [filterOrderQuantity, setFilterOrderQuantity] = useState("");

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
    
    const getStockForMedicine = (medicineName) => {
        const manufacturer = manufacturers.find(man => man.drugName === medicineName);
        return manufacturer ? manufacturer.stock : 0;
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
            var i;
            const medCtr = await supplychain.methods.medicineCtr().call();
            const med = {};
            const medStage = [];
            for (i = 0; i < medCtr; i++) {
                const medicine = await supplychain.methods.MedicineStock(i + 1).call();
                med[i] = {
                    id: medicine.id,
                    name: medicine.name,
                    description: medicine.description,
                    RMSid: medicine.RMSid,
                    MANid: medicine.MANid,
                    DISid: medicine.DISid,
                    RETid: medicine.RETid,
                    stage: medicine.stage,
                    retailer: medicine.retailer,
                    orderQuantity: medicine.orderQuantity // Sipariş adeti eklendi
                };
                medStage[i] = await supplychain.methods.showStage(i + 1).call();
            }
            setMED(med);
            setMedStage(medStage);
            setloader(false);
        } else {
            window.alert('The smart contract is not deployed to current network');
        }
    };
    

    const handlerChangeNameMED = (event) => {
        const selectedMedName = event.target.value;
        setMedName(selectedMedName);
        setMedID(medicineData[selectedMedName]?.id || '');
        setMedDes(medicineData[selectedMedName]?.description || '');
    };

    const handlerChangeRetailer = (event) => {
        const selectedRetailerName = event.target.value;
        const retailer = retailers.find(r => r.name === selectedRetailerName);
        setSelectedRetailer(retailer);
    };

    const handlerChangeOrderQuantity = (event) => {
        setOrderQuantity(event.target.value);
    };

    const handlerSubmitMED = async (event) => {
        event.preventDefault();
        const stock = getStockForMedicine(MedName);
        if (parseInt(orderQuantity) > stock) {
            setErrorMessage('Stok yok');
            return;
        }
        try {
            var reciept = await SupplyChain.methods.addMedicine(
                MedName, 
                MedDes, 
                MedID,
                selectedRetailer.name,
                orderQuantity // Sipariş adeti parametresi eklendi
            ).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
                setErrorMessage(''); // Hata mesajını temizle
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Bir hata oluştu!!!');
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

    const filteredMED = Object.keys(MED).filter(key => {
        const med = MED[key];
        return (
            (filterID === "" || (parseInt(key) + 1).toString().includes(filterID) || med.id.toLowerCase().includes(filterID.toLowerCase())) && 
            (filterName === "" || med.name.toLowerCase().includes(filterName.toLowerCase())) &&
            (filterDescription === "" || med.description.toLowerCase().includes(filterDescription.toLowerCase())) &&
            (filterStage === "" || MedStage[key].toLowerCase().includes(filterStage.toLowerCase())) &&
            (filterRetailer === "" || med.retailer.toLowerCase().includes(filterRetailer.toLowerCase())) &&
            (filterOrderQuantity === "" || med.orderQuantity.toString().includes(filterOrderQuantity))
        );
    });

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <span><b>Current Account Address:</b> {currentaccount}</span>
                <button onClick={redirect_to_home} className="btn btn-outline-danger btn-sm">HOME</button>
            </div>
    
            <h4>Add Medicine Order:</h4>
            <form onSubmit={handlerSubmitMED} className="mb-4">
                <div className="mb-3">
                    <select className="form-control" value={MedName} onChange={handlerChangeNameMED} required>
                        <option value="">Select Medicine</option>
                        {Object.keys(medicineData).map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <input className="form-control" type="text" value={MedDes} placeholder="Medicine Description" readOnly />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="text" value={MedID} placeholder="Medicine ID" readOnly />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="number" value={orderQuantity} onChange={handlerChangeOrderQuantity} placeholder="Order Quantity" required />
                </div>
                <div className="mb-3">
                    <select className="form-control" value={selectedRetailer ? selectedRetailer.name : ''} onChange={handlerChangeRetailer} required>
                        <option value="">Select Retailer</option>
                        {retailers.map((retailer, index) => (
                            <option key={index} value={retailer.name}>{retailer.name}</option>
                        ))}
                    </select>
                </div>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <button className="btn btn-outline-success btn-sm" type="submit">Order</button>
            </form>
    
            <h4>Ordered Medicines:</h4>
            <table className="table table-striped table-hover table-sm mb-4">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">
                            ID
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Filter ID"
                                value={filterID}
                                onChange={(e) => setFilterID(e.target.value)}
                            />
                        </th>
                        <th scope="col">
                            Name
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Filter Name"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                            />
                        </th>
                        <th scope="col">
                            Description
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Filter Description"
                                value={filterDescription}
                                onChange={(e) => setFilterDescription(e.target.value)}
                            />
                        </th>
                        <th scope="col">
                            Current Stage
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Filter Stage"
                                value={filterStage}
                                onChange={(e) => setFilterStage(e.target.value)}
                            />
                        </th>
                        <th scope="col">
                            Retailer
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Filter Retailer"
                                value={filterRetailer}
                                onChange={(e) => setFilterRetailer(e.target.value)}
                            />
                        </th>
                        <th scope="col">
                            Order Quantity
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Filter Order Quantity"
                                value={filterOrderQuantity}
                                onChange={(e) => setFilterOrderQuantity(e.target.value)}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMED.map((key) => (
                        <tr key={key}>
                            <td>{medicineData[MED[key].name]?.id || MED[key].id}</td>
                            <td>{MED[key].name}</td>
                            <td>{MED[key].description}</td>
                            <td>{MedStage[key]}</td>
                            <td>{MED[key].retailer}</td>
                            <td>{MED[key].orderQuantity}</td> {/* Sipariş Adeti */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );    
}

export default AddMed;