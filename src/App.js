import React, { createRef, useState } from 'react';

import * as tf from '@tensorflow/tfjs';

import ImageUpload from './components/ImageUpload';
import LoadingIndicator from './components/LoadingIndicator';
import ModalPredict from './components/ModalPredict';

function App() {
  const FISH_CLASS = [
    'lutjanus',
    'macropharyngodon',
    'oxycheilinus',
    'pervagor',
    'plectropomus',
    'pseudanthias',
    'pseudocheilinus',
    'scolopsis',
    'thalassoma',
    'wetmorella',
  ];

  const imgRef = createRef();
  const [loading, setLoading] = useState(false);
  const [predict, setPredict] = useState('');
  const [modalShow, setModalShow] = useState(false);

  const preprocessImage = (im) => {
    const tensor = tf.browser.fromPixels(im).resizeNearestNeighbor([224, 224]).toFloat();
    const offset_mobnet = tf.scalar(127.5);
    const offset_normalize = tf.scalar(255);

    return tensor.expandDims().sub(offset_mobnet).div(offset_mobnet).div(offset_normalize);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    const tensor = preprocessImage(imgRef.current);

    try {
      const model = await tf.loadLayersModel('https://storage.googleapis.com/fish_mobnet_json/model_json/model.json');
      const predicted = await model.predict(tensor).data();

      let results = Array.from(predicted)
        .map((proba, index) => {
          return { probability: proba, trueClass: FISH_CLASS[index] };
        })
        .sort((a, b) => {
          return b.probability - a.probability;
        })
        .slice(0, 1);

      let predictResult = {
        percentage: results[0].probability,
        trueClass: results[0].trueClass,
      };

      setPredict(predictResult);
      setModalShow(true);
    } catch {
      setModalShow(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white flex flex-col justify-center items-center rounded-xl py-16 px-32">
        <h1 className="text-5xl font-bold mb-6">Fish Species Prediction</h1>
        <p className="text-xl mb-2">
          <span className="font-bold">Available fish species to predict:</span> lutjanus, macropharyngodon,
          oxycheilinus, pervagor, plectropomus, pseudanthias, pseudocheilinus, scolopsis, thalassoma, and wetmorella
        </p>
        <div className="inline-flex items-center text-sm text-red-600 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          First run might be slow because the application needs to download the model first
        </div>
        <form className="" action="/" method="POST" encType="multipart/form-data" onSubmit={handleFormSubmit}>
          <ImageUpload ref={imgRef}></ImageUpload>
        </form>
      </div>
      {loading && <LoadingIndicator></LoadingIndicator>}
      <ModalPredict
        show={modalShow}
        setModalShow={setModalShow}
        trueClass={predict.trueClass}
        percentage={predict.percentage}
      ></ModalPredict>
    </div>
  );
}

export default App;
