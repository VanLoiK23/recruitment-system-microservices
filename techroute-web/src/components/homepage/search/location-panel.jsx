import cities from "../../city-province";

const LocationPanel = ({selectedLocations,onChange}) => {
  const locations = cities;

  return (
    <div className="absolute top-18 right-0 mt-2 w-64 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-1.5 max-h-[220px] overflow-y-auto z-50">
      {locations.map((location, index) => (
        <label
          key={index}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <input
            type="checkbox"
            className="w-4 h-4 rounded-[4px] border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            checked={selectedLocations.includes(location)}
            onChange={() => onChange(location)}
          />
          <span className="text-[#333333] text-[15px] select-none">
            {location}
          </span>
        </label>
      ))}
    </div>
  );
};

export default LocationPanel;
