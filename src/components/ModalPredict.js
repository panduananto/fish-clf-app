import React from 'react';

function ModalPredict({ show, setModalShow, trueClass, percentage }) {
  return (
    <>
      {show ? (
        <div id="modal-result-overlay" className="overlay">
          <div className="flex flex-col justify-center items-center w-max rounded-md shadow-lg py-8 px-16 text-center bg-white">
            <p id="text-predict-result" className="text-xl mb-6">
              {trueClass ? (
                <span>
                  Predicted class is <span className="font-bold">{trueClass}</span>, with confidence level of{' '}
                  <span className="font-bold">{(percentage * 100).toFixed(2)}%</span>
                </span>
              ) : (
                <span>Whoops! Something went wrong.</span>
              )}
            </p>
            <button id="button-modal" className="btn-primary" onClick={() => setModalShow((prev) => !prev)}>
              Ok
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ModalPredict;
