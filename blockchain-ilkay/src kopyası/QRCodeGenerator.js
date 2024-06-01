import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ value }) => {
    console.log("QR Code Value:", value); // QR kodu içeriğini konsola yazdırarak kontrol edin
    return (
        <QRCode value={value} size={256} />
    );
};

export default QRCodeGenerator;
