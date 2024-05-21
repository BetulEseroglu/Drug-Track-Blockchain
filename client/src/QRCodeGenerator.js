import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ value }) => {
    return (
        <QRCode value={value} size={256} />
    );
};

export default QRCodeGenerator;
