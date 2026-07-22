import { BarChart3, ChevronRight } from "lucide-react";
import { useState } from "react";

const CategoryPanel = ({
  categories,
  categoryContents,
  categoryActive,
  contentActive,
  onClickCategory,
  onClickContent,
  onClearAll,
  onClose,
  onApply,
}) => {
  const categoryTitles = categories?.map((category) => category.title);

  const [categoryHover, setCategoryHover] = useState(0);

  return (
    <div className="absolute max-w-[700px] top-18 left-4 z-50 p-3 bg-white border-gray-200 border shadow-[0_0_24px_rgba(0,0,0,0.06)] rounded-2xl">
      <div className="grid grid-cols-3 mb-4">
        <div className="col-span-1 flex flex-col gap-3 p-3 border-r-2 border-blue-400 font-[Inter] text-xm">
          {categoryTitles?.map((category, index) => (
            <div
              key={index}
              onMouseOver={() => {
                setCategoryHover(index);
              }}
              onClick={() => onClickCategory(index)}
              className={`hover:bg-blue-200  hover:text-blue-500 whitespace-nowrap p-1 rounded-xl cursor-pointer justify-between flex items-center gap-3
                  ${
                    categoryActive.includes(index) &&
                    "bg-blue-200 text-blue-500"
                  }
                  `}
            >
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                {category}
                {contentActive[index] && (
                  <span>({contentActive[index]?.length})</span>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>
          ))}
        </div>
        <div className="col-span-2 p-3 gap-3 font-[Inter] flex flex-wrap">
          {categoryContents[categoryHover]?.map((content, index) => (
            <div
              onClick={() => onClickContent(categoryHover, content)}
              className={`cursor-pointer px-3 py-1 rounded-3xl hover:bg-blue-200  hover:text-blue-500
                     ${
                       contentActive[categoryHover]?.includes(content)
                         ? "bg-blue-200 text-blue-500"
                         : "bg-gray-300"
                     }
                    `}
            >
              {content}
            </div>
          ))}
        </div>
      </div>
      <div className=" border-t border-gray-300 bg-white flex justify-end items-center p-3 text-xs gap-3">
        <div
          className="text-blue-500 hover:border-b border-red-400 cursor-pointer"
          onClick={onClearAll}
        >
          Clear all ({Object.values(contentActive)?.flat()?.length})
        </div>
        <div
          className="px-4 py-2 bg-gray-400 rounded-2xl hover:bg-gray-500 cursor-pointer"
          onClick={onClose}
        >
          Close
        </div>
        <div
          onClick={onApply}
          className="px-4 py-2 bg-blue-600 rounded-2xl hover:bg-blue-800 cursor-pointer text-white"
        >
          Apply
        </div>
      </div>
    </div>
  );
};

export default CategoryPanel;
