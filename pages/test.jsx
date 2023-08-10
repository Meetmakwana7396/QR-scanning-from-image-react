import React, { useRef } from 'react';
import jsQR from 'jsqr';
import toast from '@/libs/toast';

const QrScanner = ({ onChange }) => {
    const inputRef = useRef(null);

    const handleImageLoad = () => {
        const img = inputRef.current;

        if (img.complete) {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);

            const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                onChange(code);
            } else {
                toast.error('QR code not detected');
            }
        }
    };

    return (
        <>
            <label
                htmlFor="qr"
                className="absolute rounded-l-[1px] border border-white-light bg-white-light py-[9px] px-2 text-center text-sm"
            >
                Select Image
            </label>
            <input
                type="file"
                id='qr'
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const selectedImage = e.target.files[0];
                    if (selectedImage) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            inputRef.current.src = reader.result;
                            inputRef.current.onload = handleImageLoad; // Call handleImageLoad when the image loads
                        };
                        reader.readAsDataURL(selectedImage);
                    }
                }}
            />

            <img ref={inputRef} alt="Selected" className="hidden" />
        </>
    );
};

export default QrScanner;

