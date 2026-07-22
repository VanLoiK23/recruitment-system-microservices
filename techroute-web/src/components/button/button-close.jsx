import React from 'react';

function CloseButton({ onClose }) {
  return (
    <button 
      onClick={onClose}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
    >
      <svg 
        className="w-4 h-4 text-gray-500 transition-all duration-200 hover:text-gray-800 hover:rotate-90 active:scale-90" 
        viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"
      >
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

export default CloseButton;
