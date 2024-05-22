import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';
import SupplyChainABI from './artifacts/SupplyChain.json';
import { useRawMaterialSuppliers } from './AssignRoles'; // Import the custom hook

function Supply() {
    const history = useHistory();
    useEffect(() => {
        loadWeb3();
        loadBlockchainData();
    }, []);

    const [currentaccount, setCurrentaccount] = useState('');
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState({});
    const [MedStage, setMedStage] = useState({});
    const [ID, setID] = useState('');
    const rawMaterialSuppliers = useRawMaterialSuppliers(); // Use the custom hook
    const [selectedSupplier, setSelectedSupplier] = useState('');

    // State for filters
    const [rmsFilter, setRmsFilter] = useState({ id: '', name: '', place: '', addr: '' });
    const [medFilter, setMedFilter] = useState({ id: '', name: '', description: '', stage: '' });

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

    const loadBlockchainData = async () => {
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
            for (let i = 0; i < medCtr; i++) {
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

    const handlerChangeID = (event) => {
        setID(event.target.value);
    };

    const handleSupplierChange = (event) => {
        setSelectedSupplier(event.target.value);
    };

    const handleRmsFilterChange = (event) => {
        const { name, value } = event.target;
        setRmsFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
    };

    const handleMedFilterChange = (event) => {
        const { name, value } = event.target;
        setMedFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
    };

    const filterRms = (rms) => {
        return rms.filter((supplier) => {
            return (
                (rmsFilter.id === '' || supplier.id.toString().includes(rmsFilter.id)) &&
                (rmsFilter.name === '' || supplier.name.toLowerCase().includes(rmsFilter.name.toLowerCase())) &&
                (rmsFilter.place === '' || supplier.place.toLowerCase().includes(rmsFilter.place.toLowerCase())) &&
                (rmsFilter.addr === '' || supplier.addr.toLowerCase().includes(rmsFilter.addr.toLowerCase()))
            );
        });
    };

    const filterMed = (med) => {
        return Object.keys(med).filter((key) => {
            return (
                (medFilter.id === '' || med[key].id.toString().includes(medFilter.id)) &&
                (medFilter.name === '' || med[key].name.toLowerCase().includes(medFilter.name.toLowerCase())) &&
                (medFilter.description === '' || med[key].description.toLowerCase().includes(medFilter.description.toLowerCase())) &&
                (medFilter.stage === '' || MedStage[key].toLowerCase().includes(medFilter.stage.toLowerCase()))
            );
        });
    };

    const handlerSubmit = async (event, method) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods[method](ID, selectedSupplier).send({ from: currentaccount });
            if (receipt) {
                loadBlockchainData();
            }
        } catch (err) {
            alert('An error occurred!!!');
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <span><b>Current Account Address:</b> {currentaccount}</span>
                <button onClick={redirect_to_home} className="btn btn-outline-danger btn-sm">HOME</button>
            </div>

            <h6><b>Supply Chain Flow:</b></h6>
            <p>Medicine Order -&gt; Raw Material Supplier -&gt; Manufacturer -&gt; Distributor -&gt; Retailer -&gt; Consumer</p>

            <table className="table table-striped table-hover table-sm mb-4">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">Medicine ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Current Processing Stage</th>
                    </tr>
                    <tr>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="id"
                                placeholder="Filter"
                                value={medFilter.id}
                                onChange={handleMedFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="name"
                                placeholder="Filter"
                                value={medFilter.name}
                                onChange={handleMedFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="description"
                                placeholder="Filter"
                                value={medFilter.description}
                                onChange={handleMedFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="stage"
                                placeholder="Filter"
                                value={medFilter.stage}
                                onChange={handleMedFilterChange}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filterMed(MED).map((key) => (
                        <tr key={key}>
                            <td>{MED[key].id}</td>
                            <td>{MED[key].name}</td>
                            <td>{MED[key].description}</td>
                            <td>{MedStage[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h5 className="mb-4">Filter Raw Material Suppliers:</h5>
            <table className="table table-striped table-hover table-sm mb-4">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Place</th>
                        <th scope="col">Ethereum Address</th>
                    </tr>
                    <tr>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="id"
                                placeholder="Filter"
                                value={rmsFilter.id}
                                onChange={handleRmsFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="name"
                                placeholder="Filter"
                                value={rmsFilter.name}
                                onChange={handleRmsFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="place"
                                placeholder="Filter"
                                value={rmsFilter.place}
                                onChange={handleRmsFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="addr"
                                placeholder="Filter"
                                value={rmsFilter.addr}
                                onChange={handleRmsFilterChange}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filterRms(rawMaterialSuppliers).map((supplier, index) => (
                        <tr key={index}>
                            <td>{supplier.id}</td>
                            <td>{supplier.name}</td>
                            <td>{supplier.place}</td>
                            <td>{supplier.addr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title"><b>Step 1: Supply Raw Materials</b> (Only a registered Raw Material Supplier can perform this step):</h5>
                    <form onSubmit={(event) => handlerSubmit(event, 'RMSsupply')} className="mb-4">
                        <div className="input-group mb-3">
                            <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                            <select className="form-select" onChange={handleSupplierChange} required>
                                <option value="">Select Raw Material Supplier</option>
                                {filterRms(rawMaterialSuppliers).map((supplier, index) => (
                                    <option key={index} value={supplier.addr}>
                                        {supplier.name} - {supplier.place}
                                    </option>
                                ))}
                            </select>
                            <button className="btn btn-outline-success btn-sm" type="submit">Supply</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title"><b>Step 2: Manufacture</b> (Only a registered Manufacturer can perform this step):</h5>
                    <form onSubmit={(event) => handlerSubmit(event, 'Manufacturing')} className="mb-4">
                        <div className="input-group mb-3">
                            <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                            <select className="form-select" onChange={handleSupplierChange} required>
                                <option value="">Select Raw Material Supplier</option>
                                {filterRms(rawMaterialSuppliers).map((supplier, index) => (
                                    <option key={index} value={supplier.addr}>
                                        {supplier.name} - {supplier.place}
                                    </option>
                                ))}
                            </select>
                            <button className="btn btn-outline-success btn-sm" type="submit">Manufacture</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title"><b>Step 3: Distribute</b> (Only a registered Distributor can perform this step):</h5>
                    <form onSubmit={(event) => handlerSubmit(event, 'Distribute')} className="mb-4">
                        <div className="input-group mb-3">
                            <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                            <select className="form-select" onChange={handleSupplierChange} required>
                                <option value="">Select Raw Material Supplier</option>
                                {filterRms(rawMaterialSuppliers).map((supplier, index) => (
                                    <option key={index} value={supplier.addr}>
                                        {supplier.name} - {supplier.place}
                                    </option>
                                ))}
                            </select>
                            <button className="btn btn-outline-success btn-sm" type="submit">Distribute</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title"><b>Step 4: Retail</b> (Only a registered Retailer can perform this step):</h5>
                    <form onSubmit={(event) => handlerSubmit(event, 'Retail')} className="mb-4">
                        <div className="input-group mb-3">
                            <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                            <select className="form-select" onChange={handleSupplierChange} required>
                                <option value="">Select Raw Material Supplier</option>
                                {filterRms(rawMaterialSuppliers).map((supplier, index) => (
                                    <option key={index} value={supplier.addr}>
                                        {supplier.name} - {supplier.place}
                                    </option>
                                ))}
                            </select>
                            <button className="btn btn-outline-success btn-sm" type="submit">Retail</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title"><b>Step 5: Mark as sold</b> (Only a registered Retailer can perform this step):</h5>
                    <form onSubmit={(event) => handlerSubmit(event, 'sold')} className="mb-4">
                        <div className="input-group mb-3">
                            <input className="form-control" type="text" onChange={handlerChangeID} placeholder="Enter Medicine ID" required />
                            <select className="form-select" onChange={handleSupplierChange} required>
                                <option value="">Select Raw Material Supplier</option>
                                {filterRms(rawMaterialSuppliers).map((supplier, index) => (
                                    <option key={index} value={supplier.addr}>
                                        {supplier.name} - {supplier.place}
                                    </option>
                                ))}
                            </select>
                            <button className="btn btn-outline-success btn-sm" type="submit">Sold</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Supply;
