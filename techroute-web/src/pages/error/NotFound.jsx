import React from 'react';
import { Link } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

const NotFound = ()=> {
  return (
   
    <div className="min-h-screen bg-[#FAFAFB] flex flex-col items-center justify-center px-4 font-sans text-center select-none">
      
      <h1 className="text-9xl font-black text-[#5B5FC7]/15 tracking-widest animate-pulse">
        404
      </h1>
      
      <h2 className="text-2xl font-bold text-gray-800 -mt-10 mb-2">
        Page Not Found
      </h2>
      
      <p className="text-sm font-normal text-gray-500 font-ramsina max-w-sm mb-8 leading-relaxed">
        The link you accessed is invalid or the page has been moved to another URL.
      </p>
      
      <Link 
        to="/" 
        className="flex items-center gap-2 py-2.5 px-6 bg-[#5B5FC7] hover:bg-[#4a4db0] text-white text-xs font-bold rounded-[10px] shadow-[0_0_20px_rgba(91,95,199,0.15)] transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Back to Homepage</span>
      </Link>

    </div>
  );
}

export default NotFound
