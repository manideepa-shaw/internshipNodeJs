import React from 'react'
import QRCode from 'react-qr-code';

const QrCode = (props) => {
    return (
        <div className='flex flex-col flex-wrap w-full h-screen fixed top-0 left-0 bg-black bg-opacity-75 z-10 justify-center content-center'>
            <QRCode value={props.showQR} size={256} />
            <button className='bg-red-600 text-white text-xl px-2 rounded-md m-1' onClick={props.cancelQR} >Cancel</button>
        </div>
    )
}

export default QrCode