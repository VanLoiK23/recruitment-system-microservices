import React, { useState, useEffect } from 'react';

const HeroCard = ({ info }) => {
  const [count, setCount] = useState(0);

  const rawNumber = parseInt(info.stats.replace(/[^0-9]/g, ''), 10) || 0;
  
  const suffix = info.stats.replace(/[0-9,]/g, '');

  useEffect(() => {
    let startTimestamp = null;
    const duration = 3500; 

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentCount = Math.floor(easeOutProgress * rawNumber);
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [rawNumber]);

  return (
    <div className="text-center p-4 bg-white rounded-xl border border-gray-50 shadow-xs">
      <div className="text-[#5B5FC7] font-bold text-2xl mb-1 select-none">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs font-normal text-gray-400 font-ramsina tracking-wide">
        {info.label}
      </div>
    </div>
  );
};

export default HeroCard;
