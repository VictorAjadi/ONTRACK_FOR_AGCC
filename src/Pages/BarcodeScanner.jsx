import { useState, useEffect } from 'react';
import { barcodeLogin } from '../Utilities/api';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { errorMessageHandler } from '../Utilities/errorMessageHandler';
import { Html5QrcodeScanner } from "html5-qrcode";
import "./../Styles/Barcode.css"
function QRCodeReader() {
  const [qrText, setQRText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: {
        width: 250,
        height: 250 
      }
    });

    const success = async (result,decoded) => {
      scanner.clear();
        const actionData = await barcodeLogin(result.toString());
        errorMessageHandler(actionData, 'Login was successful.', 'An error occurred during QR code scanning. Please try again later or refresh.');
        if (actionData && actionData.data) {
          setTimeout(() => {
            toast.success("Login was successful.");
          }, 200);
          navigate("/", { replace: true });
        }
        setQRText(result);
    };

    
    scanner.render(success);
    // cleanup function when component will unmount
    return () => {
      scanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
      });
      setQRText('')
  };

  }, []);

  return (
    <div className='adjust-scanner add-vh'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
     
      <div id="reader"></div> {/* Render unconditionally */}
      {qrText && <div>success: {qrText}</div>}
    </div>
  );
}

export default QRCodeReader;
