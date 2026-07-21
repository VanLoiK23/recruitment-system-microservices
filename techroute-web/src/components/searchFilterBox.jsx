import React, { useState } from "react";
import {
  ChevronDown,
  Search,
  MapPin,
  SlidersHorizontal,
  Flame,
  BarChart3,
  Briefcase,
} from "lucide-react";
import categories from "./Categories";

function SearchFilterBox({ onChangeKeyword, onSubmit, onClickHotJob }) {

  const categoryTitles = categories.map(category => category.title);

  const categoryContents = categories.map(category => category.jobs);

  const [categoryActive,setCategoryActive] = useState([]);

  const [categoryHover,setCategoryHover] = useState(0);

  const [contentCategoryHover,setContentCategoryHover] = useState(0);

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col p-4 md:p-6 bg-linear-[to_right,#EEF0FC_0%,#F2F3FC_31%,#FAFAFB_100%] rounded-[11px] border-gray-200 border shadow-[0_0_24px_rgba(0,0,0,0.06)] font-sans">
      <div className="w-full flex flex-col md:flex-row gap-3 mb-5 items-stretch md:items-center">
        <div className="relative flex-1 order-1 md:order-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            onChange={onChangeKeyword}
            placeholder="Job Position, Job Apply..."
            className="w-full h-10 bg-[#F4F6FB] rounded-[10px] pl-10 pr-4 text-[13px] text-gray-800 placeholder-gray-400 border border-transparent focus:border-[#5B5FC7] focus:bg-white focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="relative grid grid-cols-2 gap-3 order-2 md:contents">
          <button className="flex items-center justify-center gap-2 h-10 py-2 px-4 bg-[#5B5FC7] text-white text-xs font-bold rounded-[10px] border border-transparent shadow-xs transition-all duration-200 hover:bg-[#4a4db0] hover:scale-[1.02] active:scale-95 cursor-pointer w-full md:w-auto md:order-1">
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="whitespace-nowrap">All Categories</span>
          </button>
          <div className="absolute max-w-[700px] top-20 left-15 p-5 grid grid-cols-3 bg-white border rounded-2xl">
            <div className="col-span-1 flex flex-col gap-3 p-3 border-r-2 border-blue-400 font-[Inter] text-xm">
              {categoryTitles.map((category, index) =>(
                  <div key={index} onMouseOver={()=>{setCategoryHover(index)}} onClick={()=>{setCategoryActive(index)}} className={`hover:bg-blue-200  hover:text-blue-500 whitespace-nowrap p-1 rounded-xl cursor-pointer flex items-center gap-3
                  ${categoryActive===index?"bg-blue-200 text-blue-500":""}
                  `}>
                    <BarChart3 className="w-3.5 h-3.5 text-blue-600" />{category}
                  </div>
              ))}
            </div>
            <div className="col-span-2 p-3 gap-3 font-[Inter] flex flex-wrap">
              {categoryContents[categoryHover].map((content,index)=>(
                <div className="cursor-pointer px-3 py-1 bg-gray-300 rounded-3xl hover:bg-blue-200  hover:text-blue-500">
                {content}
              </div>
              ))}
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 h-10 py-2 px-4 bg-white text-gray-700 text-xs font-medium rounded-[10px] border border-gray-200 shadow-xs transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95 cursor-pointer w-full md:w-auto md:order-3">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>Location</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
          </button>
        </div>

        <button
          onClick={onSubmit}
          className="h-10 py-2 px-6 bg-[#5B5FC7] text-white text-xs font-bold rounded-[10px] border border-transparent shadow-xs transition-all duration-200 hover:bg-[#4a4db0] hover:scale-[1.02] active:scale-95 cursor-pointer order-3 md:order-4 w-full md:w-auto"
        >
          Search
        </button>
      </div>

      <div className="w-full gap-3 flex flex-row items-center overflow-x-auto whitespace-nowrap pb-2 select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={onClickHotJob}
          className="flex items-center gap-1.5 py-1.5 px-3 bg-[#D6249F] text-white text-[11px] font-bold rounded-[10px] border border-[#FBE7F5] shadow-xs transition-all duration-200 hover:bg-[#b81d87] hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
        >
          <Flame className="w-3.5 h-3.5 fill-white stroke-none animate-pulse" />
          <span>Hot Job</span>
        </button>

        <button className="flex items-center gap-1.5 py-1.5 px-3 bg-white text-gray-700 text-[11px] font-medium rounded-[10px] border border-gray-200 shadow-xs transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95 cursor-pointer shrink-0">
          <BarChart3 className="w-3.5 h-3.5 text-gray-500" />
          <span>Experience level</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
        </button>

        <button className="flex items-center gap-1.5 py-1.5 px-3 bg-white text-gray-700 text-[11px] font-medium rounded-[10px] border border-gray-200 shadow-xs transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95 cursor-pointer shrink-0">
          <Briefcase className="w-3.5 h-3.5 text-gray-500" />
          <span>Work types</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
        </button>
      </div>
    </div>
  );
}

export default SearchFilterBox;
