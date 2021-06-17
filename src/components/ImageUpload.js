import React, { forwardRef, useState } from 'react';

const ImageUpload = forwardRef((props, ref) => {
  const [selectedImage, setSelectedImage] = useState('');

  const handleBrowseImage = (event) => {
    const { files } = event.target;

    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setSelectedImage(url);
    } else {
      setSelectedImage(null);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <label className="mb-4 block text-xl font-medium" htmlFor="view-fish-image">
        Please upload your fish image here
      </label>
      <div className="relative">
        <input
          className="file-input-box"
          aria-describedby="view-fish-image-help"
          id="view-fish-image"
          name="view-fish-image"
          type="file"
          onChange={handleBrowseImage}
        />
      </div>
      <div className="mt-4 mb-6 text-md text-gray-500" id="view-fish-image-help">
        Your chosen image will be shown below
      </div>
      <div className="w-96 h-auto">
        {selectedImage && (
          <img
            ref={ref}
            id="fish-image-placeholder"
            className="mb-6 w-full h-auto rounded-lg object-cover"
            src={selectedImage}
            alt=""
          />
        )}
      </div>
      <button id="button-predict" className="btn-primary">
        Predict
      </button>
    </div>
  );
});

export default ImageUpload;
