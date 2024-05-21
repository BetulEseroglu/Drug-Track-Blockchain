import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { jsPDF } from 'jspdf';

const QRCodeScanner = ({ onScan, onError }) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [isScanned, setIsScanned] = useState(false);
    const [fileName, setFileName] = useState('');

    const generateVerificationCode = () => {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setVerificationCode(code);
        return code;
    };

    const saveToPDF = (qrResult, code) => {
        const doc = new jsPDF();
        const fileName = `QRCode_${code}.pdf`;
        doc.text(`QR Code Result: ${qrResult}`, 10, 10);
        doc.text(`Verification Code: ${code}`, 10, 20);
        doc.save(fileName);
        setFileName(fileName);
    };

    return (
        <div>
            <QrReader
                delay={300}
                onError={(error) => {
                    console.error("QR Kod Hatası:", error);
                    onError(error);
                }}
                onScan={(result) => {
                    if (result) {
                        console.log("QR Kod Sonucu:", result);
                        const code = generateVerificationCode();
                        console.log("Doğrulama Kodu:", code);
                        setIsScanned(true);
                        saveToPDF(result, code);
                        onScan(result, code);
                    }
                }}
                style={{ width: '100%' }}
            />
            {isScanned && (
                <div>
                    Doğrulama Kodunuz: {verificationCode}
                    <br />
                    PDF dosyası indirildi: {fileName}
                </div>
            )}
        </div>
    );
};

export default QRCodeScanner;
