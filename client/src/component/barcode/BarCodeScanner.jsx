import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const BarCodeScanner = ({ onDetected, onClose }) => {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    // 1. Initialize the reader
    const codeReader = new BrowserMultiFormatReader();
    readerRef.current = codeReader;

    const startScanner = async () => {
      try {
        // 2. Start decoding directly from the default video device (back camera)
        // Passing 'undefined' as the first argument uses the default camera
        const controls = await codeReader.decodeFromVideoDevice(
          undefined, 
          videoRef.current, 
          (result, error, controls) => {
            if (result) {
              // console.log("Found code:", result.getText());
              
              // 3. STOP EVERYTHING IMMEDIATELY
              controls.stop(); 
              
              // 4. Then notify parent
              onDetected(result.getText());
              onClose();
            }
            // Ignore common NotFound errors as it scans frames
          }
        );

        // Store controls so we can stop if user clicks "Close"
        controlsRef.current = controls;
      } catch (err) {
        console.error("Scanner Error:", err);
      }
    };

    startScanner();

    // Cleanup when component unmounts
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, []);

  const handleManualClose = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-center">Scan Barcode</h2>
        
        <div className="relative aspect-video bg-black rounded overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" />
          {/* Visual Scanner Overlay */}
          <div className="absolute inset-0 border-2 border-dashed border-green-500/50 m-12 pointer-events-none" />
        </div>

        <button
          className="mt-6 w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
          onClick={handleManualClose}
        >
          Cancel / Close
        </button>
      </div>
    </div>
  );
};

export default BarCodeScanner;