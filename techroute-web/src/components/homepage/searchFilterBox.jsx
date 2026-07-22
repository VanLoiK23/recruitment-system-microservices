import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  ChevronDown,
  Search,
  MapPin,
  SlidersHorizontal,
  Flame,
  BarChart3,
  Briefcase,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import categories from "./Categories";
import LocationPanel from "./search/location-panel";
import CategoryPanel from "./search/category-panel";
import WorkTypePanel from "./search/worktype-panel";
import ExperiencePanel from "./search/experience-panel";

const SearchFilterBox = forwardRef(({ onSubmit }, ref) => {
  const categoryContents = categories.map((category) => category.jobs);

  const [categoryActive, setCategoryActive] = useState([]);

  const [contentActive, setContentActive] = useState({});

  const [selectedLocations, setSelectedLocations] = useState([]);

  const handleToggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location]
    );
  };

  const [selectedWorkType, setSelectedWorkType] = useState("");

  const [selectedExperience, setSelectedExperience] = useState("");

  const [showCategoryPanel, setShowCategoryPanel] = useState(false);

  const [showLocationPanel, setShowLocationPanel] = useState(false);

  const [showExperiencePanel, setShowExperiencePanel] = useState(false);

  const [showWorkTypePanel, setShowWorkTypePanel] = useState(false);

  const [hotJob, setHotJob] = useState(false);

  const [textSearch, setTextSearch] = useState("");

  const closeAllPopup = () => {
    setShowCategoryPanel(false);
    setShowLocationPanel(false);
    setShowExperiencePanel(false);
    setShowWorkTypePanel(false);
  };

  useImperativeHandle(ref, () => ({
    closePanel: () => {
      closeAllPopup();
    },
  }));

  const handleAddContentActive = (categoryIndex, content) => {
    setContentActive((prev) => {
      const currentContents = prev[categoryIndex] || [];

      if (currentContents.includes(content)) {
        return {
          ...prev,
          [categoryIndex]: currentContents.filter((item) => item !== content),
        };
      } else {
        return {
          ...prev,
          [categoryIndex]: [...currentContents, content],
        };
      }
    });
  };

  const handleAddCategoryActive = (
    categoryIndex,
    isChooseContent,
    addContent
  ) => {
    if (categoryActive.includes(categoryIndex) && !isChooseContent) {
      setCategoryActive((prev) =>
        prev.filter((item) => item !== categoryIndex)
      );

      setContentActive((prev) => {
        const newContentActive = { ...prev };
        delete newContentActive[categoryIndex];
        return newContentActive;
      });
    } else {
      if (addContent) {
        setContentActive((prev) => {
          const newContentActive = { ...prev };
          delete newContentActive[categoryIndex];
          const adjustContentActive = {
            ...newContentActive,
            [categoryIndex]: categoryContents[categoryIndex],
          };
          return adjustContentActive;
        });
      }

      setCategoryActive((prev) => [...prev, categoryIndex]);
    }
  };

  const handleSearch = () => {
    const finalFilters = {
      categories: contentActive,
      locations: selectedLocations,
      workType: selectedWorkType,
      experience: selectedExperience,
      hotJob: hotJob,
      search: textSearch,
    };
    if (onSubmit) {
      onSubmit(finalFilters);
    }

    closeAllPopup();
    //reset
    resetFilter();
  };

  const resetFilter = () => {
    setTextSearch("");
    setHotJob(false);
    setSelectedLocations([]);
    setContentActive({});
    setCategoryActive([]);
    setSelectedWorkType("");
    setSelectedExperience("");
  };

  const handleEnterSearch = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-[800px] mx-auto flex flex-col p-4 md:p-6 bg-linear-[to_right,#EEF0FC_0%,#F2F3FC_31%,#FAFAFB_100%] rounded-[11px] border-gray-200 border shadow-[0_0_24px_rgba(0,0,0,0.06)] font-sans">
      <div className="w-full flex flex-col md:flex-row gap-3 mb-5 items-stretch md:items-center">
        <div className="relative flex-1 order-1 md:order-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={textSearch}
            type="text"
            onChange={(e) => {
              setTextSearch(e.target.value);
            }}
            onKeyDown={(e) => handleEnterSearch(e)}
            placeholder="Job Position, Job Apply..."
            className="w-full h-10 bg-[#F4F6FB] rounded-[10px] pl-10 pr-4 text-[13px] text-gray-800 placeholder-gray-400 border border-transparent focus:border-[#5B5FC7] focus:bg-white focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 order-2 md:contents">
          <button
            onClick={() => {
              closeAllPopup();
              setShowCategoryPanel(!showCategoryPanel);
            }}
            className="flex items-center justify-center gap-2 h-10 py-2 px-4 bg-[#5B5FC7] text-white text-xs font-bold rounded-[10px] border border-transparent shadow-xs transition-all duration-200 hover:bg-[#4a4db0] hover:scale-[1.02] active:scale-95 cursor-pointer w-full md:w-auto md:order-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="whitespace-nowrap">All Categories</span>
          </button>
          {showCategoryPanel && (
            <CategoryPanel
              categories={categories}
              categoryContents={categoryContents}
              categoryActive={categoryActive}
              contentActive={contentActive}
              onClickCategory={(index) => {
                handleAddCategoryActive(index, false, true);
              }}
              onClickContent={(categoryHover, content) => {
                handleAddContentActive(categoryHover, content);
                handleAddCategoryActive(categoryHover, true);
              }}
              onClearAll={() => {
                setContentActive({});
                setCategoryActive([]);
              }}
              onClose={() => {
                setContentActive({});
                setCategoryActive([]);
                setShowCategoryPanel(false);
              }}
              onApply={handleSearch}
            />
          )}

          <button
            onClick={() => {
              closeAllPopup();
              setShowLocationPanel(!showLocationPanel);
            }}
            className="flex items-center justify-center gap-2 h-10 py-2 px-4 bg-white text-gray-700 text-xs font-medium rounded-[10px] border border-gray-200 shadow-xs transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95 cursor-pointer w-full md:w-auto md:order-3"
          >
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>Location</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
          </button>

          {showLocationPanel && (
            <LocationPanel
              selectedLocations={selectedLocations}
              onChange={handleToggleLocation}
            />
          )}
        </div>

        <button
          onClick={handleSearch}
          className="h-10 py-2 px-6 bg-[#5B5FC7] text-white text-xs font-bold rounded-[10px] border border-transparent shadow-xs transition-all duration-200 hover:bg-[#4a4db0] hover:scale-[1.02] active:scale-95 cursor-pointer order-3 md:order-4 w-full md:w-auto"
        >
          Search
        </button>
      </div>

      <div className="w-full gap-3 flex flex-row items-center overflow-x-auto whitespace-nowrap pb-2 select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => {
            setHotJob(!hotJob);
          }}
          className="flex items-center gap-1.5 py-1.5 px-3 bg-[#D6249F] text-white text-[11px] font-bold rounded-[10px] border border-[#FBE7F5] shadow-xs transition-all duration-200 hover:bg-[#b81d87] hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
        >
          <Flame
            className={`w-3.5 h-3.5  stroke-none animate-pulse
            ${hotJob ? "fill-yellow-400" : "fill-white"}
            `}
          />
          <span>Hot Job</span>
        </button>

        <button
          onClick={() => {
            closeAllPopup();
            setShowExperiencePanel(!showExperiencePanel);
          }}
          className="flex items-center gap-1.5 py-1.5 px-3 bg-white text-gray-700 text-[11px] font-medium rounded-[10px] border border-gray-200 shadow-xs transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95 cursor-pointer shrink-0"
        >
          <BarChart3 className="w-3.5 h-3.5 text-gray-500" />
          <span>
            {selectedExperience ? selectedExperience : "Experience level"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
        </button>
        {showExperiencePanel && (
          <ExperiencePanel
            selectedExperience={selectedExperience}
            onChange={(level) => {
              setSelectedExperience(level);
            }}
          />
        )}
        <button
          onClick={() => {
            closeAllPopup();
            setShowWorkTypePanel(!showWorkTypePanel);
          }}
          className="flex items-center gap-1.5 py-1.5 px-3 bg-white text-gray-700 text-[11px] font-medium rounded-[10px] border border-gray-200 shadow-xs transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95 cursor-pointer shrink-0"
        >
          <Briefcase className="w-3.5 h-3.5 text-gray-500" />
          <span>{selectedWorkType ? selectedWorkType : "Work types"}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
        </button>
        {showWorkTypePanel && (
          <WorkTypePanel
            selectedType={selectedWorkType}
            onChange={(type) => setSelectedWorkType(type)}
          />
        )}
      </div>
    </div>
  );
});

export default SearchFilterBox;
