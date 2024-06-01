import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SupplyChainABI from './artifacts/SupplyChain.json';
import { useHistory } from 'react-router-dom';
import QRCodeGenerator from './QRCodeGenerator';
import { saveAs } from 'file-saver';

export function useManufacturers() {
    const [manufacturers, setManufacturers] = useState([]);

    useEffect(() => {
        const loadManufacturers = async () => {
            const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
            const networkId = await web3.eth.net.getId();
            const networkData = SupplyChainABI.networks[networkId];
            if (networkData) {
                const supplyChain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
                const manCtr = await supplyChain.methods.manCtr().call();
                const man = [];
                for (let i = 0; i < manCtr; i++) {
                    const manufacturer = await supplyChain.methods.MAN(i + 1).call();
                    man.push(manufacturer);
                }
                setManufacturers(man);
            }
        };
        loadManufacturers();
    }, []);
    return manufacturers;
}

export function useRetailers() {
    const [retailers, setRetailers] = useState([]);

    useEffect(() => {
        const loadRetailers = async () => {
            const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
            const networkId = await web3.eth.net.getId();
            const networkData = SupplyChainABI.networks[networkId];
            if (networkData) {
                const supplyChain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
                const retCtr = await supplyChain.methods.retCtr().call();
                const ret = [];
                for (let i = 0; i < retCtr; i++) {
                    const retailer = await supplyChain.methods.RET(i + 1).call();
                    ret.push(retailer);
                }
                setRetailers(ret);
            }
        };
        loadRetailers();
    }, []);
    return retailers;
}

export function useRawMaterialSuppliers() {
    const [rawMaterialSuppliers, setRawMaterialSuppliers] = useState([]);

    useEffect(() => {
        const loadRawMaterialSuppliers = async () => {
            const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
            const networkId = await web3.eth.net.getId();
            const networkData = SupplyChainABI.networks[networkId];
            if (networkData) {
                const supplyChain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
                const rmsCtr = await supplyChain.methods.rmsCtr().call();
                const rms = [];
                for (let i = 0; i < rmsCtr; i++) {
                    const rawMaterialSupplier = await supplyChain.methods.RMS(i + 1).call();
                    rms.push(rawMaterialSupplier);
                }
                setRawMaterialSuppliers(rms);
            }
        };
        loadRawMaterialSuppliers();
    }, []);
    return rawMaterialSuppliers;
}

function AssignRoles() {
    const history = useHistory();
    useEffect(() => {
        loadWeb3();
        loadBlockchainData();
    }, []);

    const [currentaccount, setCurrentaccount] = useState('');
const [loader, setloader] = useState(true);
const [SupplyChain, setSupplyChain] = useState();
const [RMS, setRMS] = useState({});
const [MAN, setMAN] = useState({});
const [DIS, setDIS] = useState({});
const [RET, setRET] = useState({});
const [serialNumbers, setSerialNumbers] = useState(new Set());
const [decryptionKeys, setDecryptionKeys] = useState(new Map());
const [attemptCount, setAttemptCount] = useState(0);
const [storedData, setStoredData] = useState([]);
const [enteredSerialNumber, setEnteredSerialNumber] = useState('');
const [enteredDecryptionKey, setEnteredDecryptionKey] = useState('');
const [verificationMessage, setVerificationMessage] = useState('');
const [verificationCode, setVerificationCode] = useState('');
const [enteredCode, setEnteredCode] = useState('');
const [isCodeValid, setIsCodeValid] = useState(false);
const [qrCodeValue, setQrCodeValue] = useState('');
const [stock, setStock] = useState('');  // Burada tanımlanan stock
const [rmsFilter, setRmsFilter] = useState({ id: '', name: '', place: '', addr: '' });
const [manFilter, setManFilter] = useState({ id: '', name: '', place: '', addr: '', drugId: '', drugName: '', serialNumber: '', drugQuantity: ''});
const [disFilter, setDisFilter] = useState({ id: '', name: '', place: '', addr: '' });
const [retFilter, setRetFilter] = useState({ id: '', name: '', place: '', addr: '' });
const [RMSaddress, setRMSaddress] = useState('');
const [RMSname, setRMSname] = useState('');
const [RMSplace, setRMSplace] = useState('');
const [MANaddress, setMANaddress] = useState('');
const [MANname, setMANname] = useState('');
const [MANplace, setMANplace] = useState('');
const [DISaddress, setDISaddress] = useState('');
const [DISname, setDISname] = useState('');
const [DISplace, setDISplace] = useState('');
const [RETaddress, setRETaddress] = useState('');
const [RETname, setRETname] = useState('');
const [RETplace, setRETplace] = useState('');
const [MANdrugID, setMANdrugID] = useState('');
const [MANdrugName, setMANdrugName] = useState('');
const [MANdrugDescription, setMANdrugDescription] = useState("");
const [serialNumber, setSerialNumber] = useState('');

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
    
    const handleChangeMedicine = (event) => {
        const selectedMedicine = event.target.value;
        setMANdrugName(selectedMedicine);
        setMANdrugID(medicineData[selectedMedicine]?.id || '');
        setMANdrugDescription(medicineData[selectedMedicine]?.description || ''); 
    };
    
    const handleSerialNumberChange = (event) => {
        setSerialNumber(event.target.value);
    };

    const handleRmsFilterChange = (event) => {
        const { name, value } = event.target;
        setRmsFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
    };

    const handleManFilterChange = (event) => {
        const { name, value } = event.target;
        setManFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
    };

    const handleDisFilterChange = (event) => {
        const { name, value } = event.target;
        setDisFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
    };

    const handleRetFilterChange = (event) => {
        const { name, value } = event.target;
        setRetFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
    };

    const filterRms = (rms) => {
        return Object.keys(rms).filter((key) => {
            return (
                (rmsFilter.id === '' || rms[key].id.toString().includes(rmsFilter.id)) &&
                (rmsFilter.name === '' || rms[key].name.toLowerCase().includes(rmsFilter.name.toLowerCase())) &&
                (rmsFilter.place === '' || rms[key].place.toLowerCase().includes(rmsFilter.place.toLowerCase())) &&
                (rmsFilter.addr === '' || rms[key].addr.toLowerCase().includes(rmsFilter.addr.toLowerCase()))
            );
        });
    };

    const filterMan = (man) => {
        return Object.keys(man).filter((key) => {
            return (
                (manFilter.id === '' || (man[key].id && man[key].id.toString().includes(manFilter.id))) &&
                (manFilter.name === '' || (man[key].name && man[key].name.toLowerCase().includes(manFilter.name.toLowerCase()))) &&
                (manFilter.place === '' || (man[key].place && man[key].place.toLowerCase().includes(manFilter.place.toLowerCase()))) &&
                (manFilter.addr === '' || (man[key].addr && man[key].addr.toLowerCase().includes(manFilter.addr.toLowerCase()))) &&
                (manFilter.drugId === '' || (man[key].drugId && man[key].drugId.toString().includes(manFilter.drugId))) &&
                (manFilter.drugName === '' || (man[key].drugName && man[key].drugName.toLowerCase().includes(manFilter.drugName.toLowerCase()))) &&
                (manFilter.serialNumber === '' || (man[key].serialNumber && man[key].serialNumber.toString().includes(manFilter.serialNumber))) &&
                (manFilter.stock === '' || (man[key].stock && man[key].stock.toString().includes(manFilter.stock)))
            );
        });
    };
    
    

    const filterDis = (dis) => {
        return Object.keys(dis).filter((key) => {
            return (
                (disFilter.id === '' || dis[key].id.toString().includes(disFilter.id)) &&
                (disFilter.name === '' || dis[key].name.toLowerCase().includes(disFilter.name.toLowerCase())) &&
                (disFilter.place === '' || dis[key].place.toLowerCase().includes(disFilter.place.toLowerCase())) &&
                (disFilter.addr === '' || dis[key].addr.toLowerCase().includes(disFilter.addr.toLowerCase()))
            );
        });
    };

    const filterRet = (ret) => {
        return Object.keys(ret).filter((key) => {
            return (
                (retFilter.id === '' || ret[key].id.toString().includes(retFilter.id)) &&
                (retFilter.name === '' || ret[key].name.toLowerCase().includes(retFilter.name.toLowerCase())) &&
                (retFilter.place === '' || ret[key].place.toLowerCase().includes(retFilter.place.toLowerCase())) &&
                (retFilter.addr === '' || ret[key].addr.toLowerCase().includes(retFilter.addr.toLowerCase()))
            );
        });
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
    
            // RMS Data
            const rmsCtr = await supplychain.methods.rmsCtr().call();
            const rmsCount = web3.utils.toBN(rmsCtr).toNumber();
            const rms = {};
            for (let i = 0; i < rmsCount; i++) {
                rms[i] = await supplychain.methods.RMS(i + 1).call();
            }
            setRMS(rms);
    
            // MAN Data
            const manCtr = await supplychain.methods.manCtr().call();
            const manCount = web3.utils.toBN(manCtr).toNumber();
            const man = {};
            const serialNumbersSet = new Set();
            for (let i = 0; i < manCount; i++) {
                const manufacturer = await supplychain.methods.MAN(i + 1).call();
                const medicineName = manufacturer.drugName;
                manufacturer.drugName = medicineName;  // Adjusting drug name
                manufacturer.drugId = medicineData[medicineName]?.id || manufacturer.drugId;  // Adjusting drug ID
                manufacturer.stock = manufacturer.stock || 20;  // Ensure stock is not undefined
                console.log(`Manufacturer ${i}:`, manufacturer);  // Konsola üretici verilerini yazdır
                man[i] = manufacturer;
                serialNumbersSet.add(manufacturer.serialNumber);
            }
            setMAN(man);
            setSerialNumbers(serialNumbersSet);
    
            // DIS Data
            const disCtr = await supplychain.methods.disCtr().call();
            const disCount = web3.utils.toBN(disCtr).toNumber();
            const dis = {};
            for (let i = 0; i < disCount; i++) {
                dis[i] = await supplychain.methods.DIS(i + 1).call();
            }
            setDIS(dis);
    
            // RET Data
            const retCtr = await supplychain.methods.retCtr().call();
            const retCount = web3.utils.toBN(retCtr).toNumber();
            const ret = {};
            for (let i = 0; i < retCount; i++) {
                ret[i] = await supplychain.methods.RET(i + 1).call();
            }
            setRET(ret);
    
            setloader(false);
        } else {
            window.alert('The smart contract is not deployed to current network');
        }
    };
    

    if (loader) {
        return <div><h1 className="wait">Loading...</h1></div>;
    }

    const handlerSubmitMAN = async (event) => {
        event.preventDefault();
        const submittedStock = parseInt(stock, 10);  // Burada stock değişkenini submittedStock olarak alıyoruz.
        console.log("Submitted Stock Quantity:", submittedStock);  // Konsola girilen stok miktarını yazdır
    
        if (isCodeValid && qrCodeValue) {
            try {
                const qrContent = JSON.parse(qrCodeValue);
                const code = qrContent.code;
                const receipt = await SupplyChain.methods.addManufacturer(
                    MANaddress,
                    MANname,
                    MANplace,
                    MANdrugName,
                    MANdrugID,
                    code, // Doğrulama kodunu gönder
                    submittedStock // Stok miktarını gönder
                ).send({ from: currentaccount });
            
                console.log("Transaction receipt:", receipt);  // İşlem makbuzunu konsola yazdırarak kontrol edin
            
                if (receipt) {
                    loadBlockchainData();
                }
            } catch (err) {
                console.error(err);
                alert('Bir hata oluştu!!!');
            }
        } else {
            alert('Lütfen doğru doğrulama kodunu girin ve QR kodunu oluşturun.');
        }
    };
    
    
    const handlerSubmitRMS = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.addRMS(RMSaddress, RMSname, RMSplace).send({ from: currentaccount });
            if (receipt) {
                loadBlockchainData(); // Verileri yeniden yükle
            }
        } catch (err) {
            console.error(err);
            alert('Bir hata oluştu!!!');
        }
    };

 

    const handleCodeChange = (event) => {
        setEnteredCode(event.target.value);
        if (event.target.value === verificationCode) {
            setIsCodeValid(true);
        } else {
            setIsCodeValid(false);
        }
    };

    const generateVerificationCode = () => {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setVerificationCode(code);
        setIsCodeValid(true);
        setTimeout(() => {
            setIsCodeValid(false);
            alert('Doğrulama kodu süresi doldu. Lütfen tekrar deneyin.');
        }, 120000); // 2 dakika geçerli
        return code;
    };
    const generateSerialNumber = () => {
        const quantity = parseInt(stock, 10);
        if (isNaN(quantity) || quantity <= 0) {
            alert('Geçerli bir stok miktarı girin.');
            return;
        }
    
        const serialNumbers = new Set();
        const updatedData = [...storedData];
    
        while (serialNumbers.size < quantity) {
            let serial = Math.floor(1000 + Math.random() * 9000).toString(); // 4 haneli seri numarası
            if (Math.random() > 0.5) {
                serial += Math.floor(10 + Math.random() * 90).toString(); // Seri numarasını 6 haneye genişlet
            }
            if (!serialNumbers.has(serial)) {
                const decryptionKey = Math.random().toString(36).substr(2, 8); // Eşsiz bir şifre oluştur
                serialNumbers.add(serial);
    
                // Seri numarası ve şifreyi kaydet
                const logEntry = { serialNumber: serial, decryptionKey };
                updatedData.push(logEntry);
                setDecryptionKeys(new Map(decryptionKeys.set(serial, decryptionKey)));
            }
        }
    
        setSerialNumbers(serialNumbers);
        setStoredData(updatedData);
    
        const blob = new Blob([JSON.stringify(updatedData, null, 2)], { type: "application/json;charset=utf-8" });
        saveAs(blob, "serial_numbers_and_keys.json");
    
        // QR kodu oluştur
        generateQRCodeValue(serialNumbers.size);
    };
    
    
    const generateQRCodeValue = (quantity) => {
        const code = generateVerificationCode(); // Doğrulama kodu oluştur
        const qrContent = JSON.stringify({ stock: quantity, code }); // QR kodu içeriğine stok adeti ve doğrulama kodu ekle
        console.log("Generated QR Content:", qrContent); // QR kodu içeriğini konsola yazdırarak kontrol edin
        setQrCodeValue(qrContent); // QR kodu içeriğini geç
    };

    

const verifyProduct = () => {
    if (attemptCount >= 3) {
        setVerificationMessage('Şifre deneme hakkınız doldu.');
        return;
    }

    const foundEntry = storedData.find(
        (entry) => entry.serialNumber === enteredSerialNumber && entry.decryptionKey === enteredDecryptionKey
    );

    if (foundEntry) {
        setVerificationMessage('Ürün orijinaldir.');
        setAttemptCount(0); // Başarılı doğrulamada deneme sayısını sıfırla
    } else {
        setVerificationMessage('Ürün sahte veya bilgiler yanlıştır.');
        setAttemptCount(prevCount => prevCount + 1); // Başarısız doğrulamada deneme sayısını artır
    }

}
    const handlerSubmitDIS = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.addDistributor(DISaddress, DISname, DISplace).send({ from: currentaccount });
            if (receipt) {
                loadBlockchainData();
            }
        } catch (err) {
            alert('Bir hata oluştu!!!');
        }
    };

    const handlerSubmitRET = async (event) => {
        event.preventDefault();
        try {
            const receipt = await SupplyChain.methods.addRetailer(RETaddress, RETname, RETplace).send({ from: currentaccount });
            if (receipt) {
                loadBlockchainData();
            }
        } catch (err) {
            alert('Bir hata oluştu!!!');
        }
    };

    const redirect_to_home = () => {
        history.push('/');
    };

    const handlerChangeAddressRMS = (event) => {
        setRMSaddress(event.target.value);
    };
    const handlerChangePlaceRMS = (event) => {
        setRMSplace(event.target.value);
    };
    const handlerChangeNameRMS = (event) => {
        setRMSname(event.target.value);
    };
    const handlerChangeAddressMAN = (event) => {
        setMANaddress(event.target.value);
    };
    const handlerChangePlaceMAN = (event) => {
        setMANplace(event.target.value);
    };
    const handlerChangeNameMAN = (event) => {
        setMANname(event.target.value);
    };
    const handlerChangeAddressDIS = (event) => {
        setDISaddress(event.target.value);
    };
    const handlerChangePlaceDIS = (event) => {
        setDISplace(event.target.value);
    };
    const handlerChangeNameDIS = (event) => {
        setDISname(event.target.value);
    };
    const handlerChangeAddressRET = (event) => {
        setRETaddress(event.target.value);
    };
    const handlerChangePlaceRET = (event) => {
        setRETplace(event.target.value);
    };
    const handlerChangeNameRET = (event) => {
        setRETname(event.target.value);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <span><b>Mevcut Hesap Adresi:</b> {currentaccount}</span>
                <button onClick={redirect_to_home} className="btn btn-outline-danger btn-sm">ANA SAYFA</button>
            </div>

            <h4>Ham Madde Tedarikçileri:</h4>
            <form onSubmit={handlerSubmitRMS} className="mb-4">
                <div className="mb-3">
                    <input className="form-control" type="text" onChange={handlerChangeAddressRMS} placeholder="Ethereum Adresi" required />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="text" onChange={handlerChangeNameRMS} placeholder="Ham Madde Tedarikçi Adı" required />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="text" onChange={handlerChangePlaceRMS} placeholder="Konum" required />
                </div>
                <button className="btn btn-outline-success btn-sm" type="submit">Kayıt</button>
            </form>

            <table className="table table-striped table-hover table-sm mb-4">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Adı</th>
                        <th scope="col">Konum</th>
                        <th scope="col">Ethereum Adresi</th>
                    </tr>
                    <tr>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="id"
                                placeholder="Filtre"
                                value={rmsFilter.id}
                                onChange={handleRmsFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="name"
                                placeholder="Filtre"
                                value={rmsFilter.name}
                                onChange={handleRmsFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="place"
                                placeholder="Filtre"
                                value={rmsFilter.place}
                                onChange={handleRmsFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="addr"
                                placeholder="Filtre"
                                value={rmsFilter.addr}
                                onChange={handleRmsFilterChange}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filterRms(RMS).map((key) => (
                        <tr key={key}>
                            <td>{RMS[key].id}</td>
                            <td>{RMS[key].name}</td>
                            <td>{RMS[key].place}</td>
                            <td>{RMS[key].addr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4>Üreticiler:</h4>
        <form onSubmit={handlerSubmitMAN} className="mb-4">
            <div className="mb-3">
                <input className="form-control" type="text" onChange={handlerChangeAddressMAN} placeholder="Ethereum Adresi" required />
            </div>
            <div className="mb-3">
                <input className="form-control" type="text" onChange={handlerChangeNameMAN} placeholder="Üretici Adı" required />
            </div>
            <div className="mb-3">
                <input className="form-control" type="text" onChange={handlerChangePlaceMAN} placeholder="Konum" required />
            </div>
            <div className="mb-3">
                <select className="form-control" value={MANdrugName} onChange={(e) => {
                    const selectedMedName = e.target.value;
                    setMANdrugName(selectedMedName);
                    setMANdrugID(medicineData[selectedMedName]?.id || "");
                    setMANdrugDescription(medicineData[selectedMedName]?.description || "");
                }} required>
                    <option value="">Select Medicine</option>
                    {Object.keys(medicineData).map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <input className="form-control" type="text" value={MANdrugDescription} placeholder="Medicine Description" readOnly />
            </div>
            <div className="mb-3">
                <input className="form-control" type="text" value={MANdrugID} placeholder="Medicine ID" readOnly />
            </div>
            <div className="mb-3">
                    <input className="form-control" type="number" onChange={(e) => setStock(e.target.value)} placeholder="Stok Bilgisi" required />
                </div>
            <div className="mb-3 d-flex align-items-center">
                <div className="serial-number-container d-flex">
                    <button type="button" onClick={generateSerialNumber} className="btn btn-outline-primary btn-sm">Seri No Oluştur</button>
                </div>
            </div>
    
            <div className="mb-3">
                <input className="form-control" type="text" onChange={handleCodeChange} placeholder="Doğrulama Kodu" required />
            </div>
            <button className="btn btn-outline-success btn-sm" type="submit" disabled={!isCodeValid}>Kayıt</button>
        </form>

        {qrCodeValue && (
    <div>
        <h5>QR Kod:</h5>
        <QRCodeGenerator value={{ qrContent: qrCodeValue }} />
    </div>
)}
<table className="table table-striped table-hover table-sm mb-4">
    <thead className="table-dark">
        <tr>
            <th scope="col">ID</th>
            <th scope="col">Adı</th>
            <th scope="col">Konum</th>
            <th scope="col">Ethereum Adresi</th>
            <th scope="col">İlaç ID</th>
            <th scope="col">İlaç Adı</th>
            <th scope="col">Seri Numarası</th>
            <th scope="col">Stok</th>
        </tr>
        <tr>
            <th>
                <input
                    className="form-control form-control-sm"
                    type="text"
                    name="id"
                    placeholder="Filtre"
                    value={manFilter.id}
                    onChange={handleManFilterChange}
                />
            </th>
            <th>
                <input
                    className="form-control form-control-sm"
                    type="text"
                    name="name"
                    placeholder="Filtre"
                    value={manFilter.name}
                    onChange={handleManFilterChange}
                />
            </th>
            <th>
                <input
                    className="form-control form-control-sm"
                    type="text"
                    name="place"
                    placeholder="Filtre"
                    value={manFilter.place}
                    onChange={handleManFilterChange}
                />
            </th>
            <th>
                <input
                    className="form-control form-control-sm"
                    type="text"
                    name="addr"
                    placeholder="Filtre"
                    value={manFilter.addr}
                    onChange={handleManFilterChange}
                />
            </th>
            <th>
                <input
                    className="form-control form-control-sm"
                    type="text"
                    name="drugId"
                    placeholder="Filtre"
                    value={manFilter.drugId}
                    onChange={handleManFilterChange}
                />
            </th>
            <th>
                <input
                    className="form-control form-control-sm"
                    type="text"
                    name="drugName"
                    placeholder="Filtre"
                    value={manFilter.drugName}
                    onChange={handleManFilterChange}
                />
            </th>
            <th>
                <input
                    className="form-control form-control-sm"
                    type="text"
                    name="serialNumber"
                    placeholder="Filtre"
                    value={manFilter.serialNumber}
                    onChange={handleManFilterChange}
                />
            </th>
            <th>
                <input
                    className="form-control form-control-sm"
                    type="text"
                    name="stock"
                    placeholder="Filtre"
                    value={manFilter.stock}
                    onChange={handleManFilterChange}
                />
            </th>
        </tr>
    </thead>
    <tbody>
        {Object.keys(MAN).map((key) => (
            <tr key={key}>
                <td>{MAN[key].id}</td>
                <td>{MAN[key].name}</td>
                <td>{MAN[key].place}</td>
                <td>{MAN[key].addr}</td>
                <td>{MAN[key].drugId}</td>
                <td>{MAN[key].drugName}</td>
                <td>{'***'}</td>
                <td>{MAN[key].stock}</td>
            </tr>
        ))}
    </tbody>
</table>

            <h4>Ürün Doğrula:</h4>
        <form className="mb-4">
            <div className="mb-3">
                <input
                    className="form-control"
                    type="text"
                    value={enteredSerialNumber}
                    onChange={(e) => setEnteredSerialNumber(e.target.value)}
                    placeholder="Seri Numarası"
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    className="form-control"
                    type="text"
                    value={enteredDecryptionKey}
                    onChange={(e) => setEnteredDecryptionKey(e.target.value)}
                    placeholder="Şifre"
                    required
                />
            </div>
            <button type="button" onClick={verifyProduct} className="btn btn-outline-primary btn-sm">Doğrula</button>
            {verificationMessage && <p>{verificationMessage}</p>}
        </form>



            <h4>Distribütörler:</h4>
            <form onSubmit={handlerSubmitDIS} className="mb-4">
                <div className="mb-3">
                    <input className="form-control" type="text" onChange={handlerChangeAddressDIS} placeholder="Ethereum Adresi" required />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="text" onChange={handlerChangeNameDIS} placeholder="Distribütör Adı" required />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="text" onChange={handlerChangePlaceDIS} placeholder="Konum" required />
                </div>
                <button className="btn btn-outline-success btn-sm" type="submit">Kayıt</button>
            </form>

            <table className="table table-striped table-hover table-sm mb-4">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Adı</th>
                        <th scope="col">Konum</th>
                        <th scope="col">Ethereum Adresi</th>
                    </tr>
                    <tr>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="id"
                                placeholder="Filtre"
                                value={disFilter.id}
                                onChange={handleDisFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="name"
                                placeholder="Filtre"
                                value={disFilter.name}
                                onChange={handleDisFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="place"
                                placeholder="Filtre"
                                value={disFilter.place}
                                onChange={handleDisFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="addr"
                                placeholder="Filtre"
                                value={disFilter.addr}
                                onChange={handleDisFilterChange}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filterDis(DIS).map((key) => (
                        <tr key={key}>
                            <td>{DIS[key].id}</td>
                            <td>{DIS[key].name}</td>
                            <td>{DIS[key].place}</td>
                            <td>{DIS[key].addr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4>Perakendeciler:</h4>
            <form onSubmit={handlerSubmitRET} className="mb-4">
                <div className="mb-3">
                    <input className="form-control" type="text" onChange={handlerChangeAddressRET} placeholder="Ethereum Adresi" required />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="text" onChange={handlerChangeNameRET} placeholder="Perakendeci Adı" required />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="text" onChange={handlerChangePlaceRET} placeholder="Konum" required />
                </div>
                <button className="btn btn-outline-success btn-sm" type="submit">Kayıt</button>
            </form>

            <table className="table table-striped table-hover table-sm mb-4">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Adı</th>
                        <th scope="col">Konum</th>
                        <th scope="col">Ethereum Adresi</th>
                    </tr>
                    <tr>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="id"
                                placeholder="Filtre"
                                value={retFilter.id}
                                onChange={handleRetFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="name"
                                placeholder="Filtre"
                                value={retFilter.name}
                                onChange={handleRetFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="place"
                                placeholder="Filtre"
                                value={retFilter.place}
                                onChange={handleRetFilterChange}
                            />
                        </th>
                        <th>
                            <input
                                className="form-control form-control-sm"
                                type="text"
                                name="addr"
                                placeholder="Filter"
                                value={retFilter.addr}
                                onChange={handleRetFilterChange}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filterRet(RET).map((key) => (
                        <tr key={key}>
                            <td>{RET[key].id}</td>
                            <td>{RET[key].name}</td>
                            <td>{RET[key].place}</td>
                            <td>{RET[key].addr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AssignRoles;