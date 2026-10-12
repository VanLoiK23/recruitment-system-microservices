import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload,
  MapPin,
  Building,
  ShieldCheck,
  AlertCircle,
  Info,
  Plus,
  X,
  Image as ImageIcon,
  FileText,
  Trash2,
  LocateFixed,
  Globe,
  Users,
  Briefcase,
  Building2,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "../../../utils/axios.customize";
import { toast } from "react-toastify";
import CircleLoading from "../../../components/animation/animate-loading";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const FALLBACK_CENTER = { lat: 16.0544, lng: 108.2022 };

const INITIAL_FORM_DATA = {
  id: "",
  ownerEmail: "",
  companyName: "",
  website: "",
  industry: "",
  companySize: "",
  taxId: "",
  aboutUs: "",
  verificationStatus: "PENDING",
  businessLicenseUrl: "",
  logoUrl: "",
  coverImageUrl: "",
  benefits: [],
  galleryImages: [],
  headquarters: {
    address: "",
    district: "",
    cityProvince: "",
    country: "Vietnam",
    isHeadquarters: true,
    coordinates: null,
  },
  branches: [],
};

function LocationPicker({ onLocationSelect, disabled }) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 16, { animate: true });
  }, [center, map]);
  return null;
}

export default function CompanyTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [userRole, setUserRole] = useState("RECRUITER");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [mapCenter, setMapCenter] = useState(null);

  const fileInputRef = useRef(null);
  const [uploadTarget, setUploadTarget] = useState(null);
  const geocodeTimeoutRef = useRef(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isNewCompany, setNewCompany] = useState(true);
  const [isSaveLoading, setSaveLoading] = useState(false);

  const [companiesList, setCompaniesList] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("NEW_COMPANY");
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const switcherRef = useRef(null);

  useEffect(() => {
    fetchMyCompanies();

    const handleClickOutside = (e) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target))
        setIsSwitcherOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(geocodeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (selectedCompanyId === "NEW_COMPANY") {
      handlePrepareNewCompany();
    } else {
      fetchCompanyData(selectedCompanyId);
    }
  }, [selectedCompanyId]);

  const fetchMyCompanies = async () => {
    try {
      const data = await axios.get(`profile/my-companies`);

      // const mockList = [
      //   { id: "comp_123", name: "TechRoute Corp", role: "OWNER", logo: null },
      //   { id: "comp_456", name: "VNG Group", role: "RECRUITER", logo: null },
      // ];
      if (data) {
        setCompaniesList(data);
      }

      if (data.length > 0) {
        setSelectedCompanyId(data[0].id);
      } else {
        setSelectedCompanyId("NEW_COMPANY");
      }
    } catch (err) {
      console.error("Error loading companies list:", err);
    }
  };

  const handlePrepareNewCompany = () => {
    setIsLoading(true);
    setFormData(INITIAL_FORM_DATA);
    setNewCompany(true);
    setCanEdit(true);
    setUserRole("OWNER");
    setMapCenter(FALLBACK_CENTER);
    setIsLoading(false);
  };

  const fetchCompanyData = async (companyId) => {
    try {
      setIsLoading(true);
      const data = await axios.get(`profile/companies/${companyId}`);

      if (data) {
        setFormData(data);
        setNewCompany(false);

        const roleInCompany =
          companiesList.find((c) => c.id === companyId)?.role || "MEMBER";
        setUserRole(roleInCompany);
        setCanEdit(roleInCompany === "OWNER" || roleInCompany === "ADMIN");

        const existingLng = data.headquarters?.coordinates?.coordinates?.[0];
        const existingLat = data.headquarters?.coordinates?.coordinates?.[1];

        if (existingLat && existingLng) {
          setMapCenter({ lat: existingLat, lng: existingLng });
        } else {
          setMapCenter(FALLBACK_CENTER);
        }
      }
    } catch (err) {
      toast.error("Failed to load company profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const reverseGeocode = useCallback(async (lat, lng, branchIndex = null) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "TechRouteApp/1.0",
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) return;
      const data = await response.json();
      const addr = data.address || {};
      const cityProvince = addr.city || addr.town || addr.state || "";
      const district = addr.city_district || addr.district || addr.suburb || "";
      const detailedAddress =
        [addr.house_number, addr.road, addr.suburb]
          .filter(Boolean)
          .join(", ") ||
        data.display_name ||
        "";

      setFormData((prev) => {
        if (branchIndex === null) {
          return {
            ...prev,
            headquarters: {
              ...prev.headquarters,
              address: detailedAddress,
              district,
              cityProvince,
              country: addr.country || "Vietnam",
            },
          };
        } else {
          const updatedBranches = [...prev.branches];
          updatedBranches[branchIndex] = {
            ...updatedBranches[branchIndex],
            address: detailedAddress,
            district,
            cityProvince,
            country: addr.country || "Vietnam",
          };
          return { ...prev, branches: updatedBranches };
        }
      });
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  }, []);

  const updateLocation = useCallback(
    (lat, lng, branchIndex = null) => {
      if (!canEdit) return;
      const latitude = Number(lat.toFixed(6));
      const longitude = Number(lng.toFixed(6));

      setFormData((prev) => {
        if (branchIndex === null) {
          return {
            ...prev,
            headquarters: {
              ...prev.headquarters,
              coordinates: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
            },
          };
        } else {
          const updatedBranches = [...prev.branches];
          updatedBranches[branchIndex] = {
            ...updatedBranches[branchIndex],
            coordinates: { type: "Point", coordinates: [longitude, latitude] },
          };
          return { ...prev, branches: updatedBranches };
        }
      });

      clearTimeout(geocodeTimeoutRef.current);
      geocodeTimeoutRef.current = setTimeout(
        () => reverseGeocode(latitude, longitude, branchIndex),
        700
      );
    },
    [canEdit, reverseGeocode]
  );

  const getCurrentLocation = useCallback(
    (branchIndex = null) => {
      if (!canEdit || !navigator.geolocation) {
        setLocationError("Browser does not support geolocation.");
        return;
      }
      setIsGettingLocation(true);
      setLocationError("");

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateLocation(
            pos.coords.latitude,
            pos.coords.longitude,
            branchIndex
          );
          if (branchIndex === null)
            setMapCenter({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          setIsGettingLocation(false);
        },
        () => {
          setLocationError("Unable to retrieve location.");
          setIsGettingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    },
    [canEdit, updateLocation]
  );

  const triggerUpload = (target) => {
    if (!canEdit) return;
    setUploadTarget(target);
    fileInputRef.current.accept =
      target === "businessLicense"
        ? "image/png, image/jpeg, image/webp, application/pdf"
        : "image/png, image/jpeg, image/webp";
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");

    if (uploadTarget === "businessLicense") {
      if (!isPdf && !isImage) {
        toast.warn("Must be PDF or Image");
        return;
      }
    } else {
      if (!isImage) {
        toast.warn("Must be an Image");
        return;
      }
    }

    setSaveLoading(true);

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("type", uploadTarget);
    if (formData.id) uploadData.append("companyId", formData.id);

    try {
      const { data } = await axios.post(
        "profile/companies/upload",
        uploadData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const secureUrl = data.url;

      if (!formData.id && data.newCompanyId) {
        setFormData((p) => ({ ...p, id: data.newCompanyId }));
      }

      setFormData((prev) => {
        if (uploadTarget === "gallery")
          return { ...prev, galleryImages: [...prev.galleryImages, secureUrl] };
        if (uploadTarget === "businessLicense")
          return { ...prev, businessLicenseUrl: secureUrl };
        return { ...prev, [`${uploadTarget}Url`]: secureUrl };
      });
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      event.target.value = "";
      setUploadTarget(null);
      setSaveLoading(false);
    }
  };

  const handleAddBranch = () => {
    setFormData((prev) => ({
      ...prev,
      branches: [
        ...prev.branches,
        {
          address: "",
          district: "",
          cityProvince: "",
          country: "Vietnam",
          isHeadquarters: false,
          coordinates: null,
        },
      ],
    }));
  };

  const handleRemoveBranch = (index) => {
    setFormData((prev) => ({
      ...prev,
      branches: prev.branches.filter((_, idx) => idx !== index),
    }));
  };

  const handleBranchChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.branches];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, branches: updated };
    });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const method = isNewCompany ? "post" : "put";
      const endpoint = isNewCompany
        ? `profile/companies`
        : `profile/companies/${formData.id}`;

      const data = await axios[method](endpoint, formData);
      toast.success("Profile saved successfully!");

      if (isNewCompany) {
        setNewCompany(false);
        setFormData((p) => ({ ...p, id: data.id }));
        fetchMyCompanies();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred!"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const inputClass =
    "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#5D5CDE] transition-all text-sm";

  const renderCompanySwitcher = () => {
    const currentCompanyInfo = companiesList.find(
      (c) => c.id === selectedCompanyId
    ) || { name: "New Workspace", role: "CREATOR" };

    return (
      <div
        className="relative font-['Be_Vietnam_Pro'] mb-8 z-[100]"
        ref={switcherRef}
      >
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Workspace
        </label>
        <button
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          className="w-[300px] flex items-center justify-between bg-white border border-gray-200 hover:border-[#5D5CDE] p-2.5 rounded-xl shadow-sm transition-all duration-200"
        >
          <div className="flex items-center gap-3 truncate">
            <div className="w-10 h-10 shrink-0 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
              {currentCompanyInfo?.logo ? (
                <img
                  src={currentCompanyInfo.logo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 size={20} className="text-[#5D5CDE]" />
              )}
            </div>
            <div className="text-left truncate">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {currentCompanyInfo.name}
              </h3>
              <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                {currentCompanyInfo.role}
              </span>
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform ${
              isSwitcherOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isSwitcherOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-[300px] bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="max-h-[280px] overflow-y-auto p-1.5">
              {companiesList.map((company) => {
                const isSelected = company.id === selectedCompanyId;
                return (
                  <button
                    key={company.id}
                    onClick={() => {
                      setSelectedCompanyId(company.id);
                      setIsSwitcherOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                      isSelected ? "bg-indigo-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 shrink-0 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 size={14} className="text-gray-400" />
                        )}
                      </div>
                      <div className="text-left truncate">
                        <p
                          className={`text-sm font-semibold truncate ${
                            isSelected ? "text-[#5D5CDE]" : "text-gray-700"
                          }`}
                        >
                          {company.name}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check
                        size={16}
                        className="text-[#5D5CDE] shrink-0 ml-2"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="p-2 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => {
                  setSelectedCompanyId("NEW_COMPANY");
                  setIsSwitcherOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-[#5D5CDE] bg-white border border-[#5D5CDE]/20 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Plus size={16} /> Create New Company
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReadOnlyCard = () => {
    const hqLng =
      formData.headquarters?.coordinates?.coordinates?.[0] ??
      FALLBACK_CENTER.lng;
    const hqLat =
      formData.headquarters?.coordinates?.coordinates?.[1] ??
      FALLBACK_CENTER.lat;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-6">
        <div className="relative h-48 bg-slate-100">
          {formData.coverImageUrl ? (
            <img
              src={formData.coverImageUrl}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-50 to-indigo-50" />
          )}
          <div className="absolute -bottom-12 left-8 p-1.5 bg-white rounded-2xl shadow-md">
            <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <Building size={32} className="text-gray-300" />
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {formData.companyName || "Unnamed Company"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                {formData.industry && (
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} /> {formData.industry}
                  </span>
                )}
                {formData.companySize && (
                  <span className="flex items-center gap-1">
                    <Users size={14} /> {formData.companySize}
                  </span>
                )}
                {formData.taxId && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Tax ID: {formData.taxId}
                  </span>
                )}
                {formData.website && (
                  <a
                    href={formData.website}
                    target="_blank"
                    className="flex items-center gap-1 text-[#5D5CDE] hover:underline"
                  >
                    <Globe size={14} /> Website
                  </a>
                )}
                {formData.businessLicenseUrl && (
                  <a
                    href={formData.businessLicenseUrl}
                    target="_blank"
                    className="flex items-center gap-1 text-emerald-600 hover:underline"
                  >
                    <FileText size={14} /> Business License
                  </a>
                )}
              </div>
            </div>
            <span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                formData.verificationStatus === "VERIFIED"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-amber-50 text-amber-600 border-amber-200"
              }`}
            >
              {formData.verificationStatus === "VERIFIED" ? (
                <ShieldCheck size={14} />
              ) : (
                <AlertCircle size={14} />
              )}{" "}
              {formData.verificationStatus}
            </span>
          </div>

          {formData.aboutUs && (
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900 mb-2">About Us</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">
                {formData.aboutUs}
              </p>
            </div>
          )}
          {formData.benefits.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Company Benefits
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((b, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-[#5D5CDE]/10 text-[#5D5CDE] rounded-lg text-sm font-medium"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-[#5D5CDE]" /> Headquarters
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {formData.headquarters.address || "No address"},{" "}
              {formData.headquarters.district},{" "}
              {formData.headquarters.cityProvince}
            </p>
            <div className="border border-gray-200 rounded-xl overflow-hidden h-[200px] pointer-events-none opacity-90">
              {mapCenter && (
                <MapContainer
                  center={[hqLat, hqLng]}
                  zoom={15}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  dragging={false}
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[hqLat, hqLng]} />
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditForm = () => {
    const hqLng =
      formData.headquarters?.coordinates?.coordinates?.[0] ??
      mapCenter?.lng ??
      FALLBACK_CENTER.lng;
    const hqLat =
      formData.headquarters?.coordinates?.coordinates?.[1] ??
      mapCenter?.lat ??
      FALLBACK_CENTER.lat;

    return (
      <div className="space-y-8 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-14 relative">
          <div className="h-48 bg-slate-50 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
            {formData.coverImageUrl ? (
              <img
                src={formData.coverImageUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="text-gray-300 w-12 h-12" />
            )}
            <button
              type="button"
              onClick={() => triggerUpload("coverImage")}
              className="absolute flex items-center gap-2 px-4 py-2 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Upload size={16} /> Update Cover
            </button>
          </div>
          <div className="absolute -bottom-8 left-8 w-24 h-24 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center relative overflow-hidden group">
            {formData.logoUrl ? (
              <img
                src={formData.logoUrl}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Building size={32} className="text-gray-300" />
            )}
            <div
              onClick={() => triggerUpload("logo")}
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
            >
              <Upload size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Company Size
            </label>
            <select
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select size</option>
              <option value="1-50 employees">1-50 employees</option>
              <option value="51-200 employees">51-200 employees</option>
              <option value="201-500 employees">201-500 employees</option>
              <option value="500+ employees">500+ employees</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tax ID
            </label>
            <input
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Business License
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => triggerUpload("businessLicense")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
              >
                Upload Document
              </button>
              {formData.businessLicenseUrl && (
                <a
                  href={formData.businessLicenseUrl}
                  target="_blank"
                  className="text-sm text-[#5D5CDE] flex items-center gap-1 hover:underline"
                >
                  <FileText size={16} /> View
                </a>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              About Us
            </label>
            <textarea
              name="aboutUs"
              value={formData.aboutUs}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="text-[#5D5CDE]" size={18} /> Headquarters
              Address
            </h4>
            <button
              type="button"
              onClick={() => getCurrentLocation(null)}
              disabled={isGettingLocation}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100"
            >
              <LocateFixed
                size={16}
                className={
                  isGettingLocation
                    ? "animate-spin text-[#5D5CDE]"
                    : "text-gray-500"
                }
              />{" "}
              Get Current GPS
            </button>
          </div>
          {locationError && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-700 text-xs rounded-lg">
              {locationError}
            </div>
          )}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="City / Province"
              value={formData.headquarters.cityProvince}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  headquarters: {
                    ...p.headquarters,
                    cityProvince: e.target.value,
                  },
                }))
              }
              className={inputClass}
            />
            <input
              type="text"
              placeholder="District"
              value={formData.headquarters.district}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  headquarters: { ...p.headquarters, district: e.target.value },
                }))
              }
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Detailed Address"
              value={formData.headquarters.address}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  headquarters: { ...p.headquarters, address: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden relative h-[280px]">
            {mapCenter && (
              <MapContainer
                center={[hqLat, hqLng]}
                zoom={15}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapController center={[hqLat, hqLng]} />
                <LocationPicker
                  onLocationSelect={(lat, lng) =>
                    updateLocation(lat, lng, null)
                  }
                />
                <Marker position={[hqLat, hqLng]} />
              </MapContainer>
            )}
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Building className="text-[#5D5CDE]" size={18} /> Branch Offices
            </h4>
            <button
              type="button"
              onClick={handleAddBranch}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5D5CDE]/10 text-[#5D5CDE] rounded-lg text-sm font-medium"
            >
              <Plus size={16} /> Add Branch
            </button>
          </div>
          {formData.branches.map((b, idx) => {
            const bLng = b.coordinates?.coordinates?.[0] ?? FALLBACK_CENTER.lng;
            const bLat = b.coordinates?.coordinates?.[1] ?? FALLBACK_CENTER.lat;
            return (
              <div
                key={idx}
                className="p-5 bg-gray-50 border border-gray-200 rounded-xl relative mb-6"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveBranch(idx)}
                  className="absolute top-4 right-4 text-red-500 hover:bg-gray-100 p-1 rounded-md"
                >
                  <Trash2 size={16} />
                </button>
                <p className="text-sm font-bold mb-4">Branch #{idx + 1}</p>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="City / Province"
                    value={b.cityProvince}
                    onChange={(e) =>
                      handleBranchChange(idx, "cityProvince", e.target.value)
                    }
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="District"
                    value={b.district}
                    onChange={(e) =>
                      handleBranchChange(idx, "district", e.target.value)
                    }
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Detailed Address"
                    value={b.address}
                    onChange={(e) =>
                      handleBranchChange(idx, "address", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <div className="border border-gray-200 rounded-xl h-[200px] overflow-hidden">
                  <MapContainer
                    center={[bLat, bLng]}
                    zoom={14}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapController center={[bLat, bLng]} />
                    <LocationPicker
                      onLocationSelect={(lat, lng) =>
                        updateLocation(lat, lng, idx)
                      }
                    />
                    <Marker position={[bLat, bLng]} />
                  </MapContainer>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <h4 className="font-bold text-gray-900 mb-3">Company Benefits</h4>
          <div className="flex flex-wrap gap-2">
            {formData.benefits.map((b, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#5D5CDE]/10 text-[#5D5CDE] rounded-lg text-sm font-medium"
              >
                {b}{" "}
                <button
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      benefits: p.benefits.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  <X size={14} className="hover:text-red-500" />
                </button>
              </span>
            ))}
            <button
              onClick={() => {
                const val = prompt("Enter new benefit:");
                if (val)
                  setFormData((p) => ({
                    ...p,
                    benefits: [...p.benefits, val],
                  }));
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
            >
              <Plus size={14} /> Add Benefit
            </button>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Office Gallery</h4>
            <button
              type="button"
              onClick={() => triggerUpload("gallery")}
              className="flex items-center gap-1 text-sm font-medium text-[#5D5CDE]"
            >
              <Plus size={16} /> Add Photo
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {formData.galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="aspect-video rounded-xl relative group overflow-hidden"
              >
                <img src={img} className="w-full h-full object-cover" />
                <button
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      galleryImages: p.galleryImages.filter(
                        (_, i) => i !== idx
                      ),
                    }))
                  }
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={isSaveLoading}
            className={`px-8 py-3 font-bold rounded-xl shadow-md
              ${
                isSaveLoading
                  ? "bg-gray-400 text-black"
                  : "bg-[#5D5CDE] text-white"
              }
              `}
          >
            {isSaveLoading && <CircleLoading />} Save All Changes
          </button>
        </div>
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-400">
        Loading company profile... <CircleLoading />
      </div>
    );

  return (
    <div className="p-8 font-['Be_Vietnam_Pro'] max-w-4xl mx-auto">
      {renderCompanySwitcher()}

      {!canEdit && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 mb-6">
          <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-bold">View-Only Mode</h4>
            <p className="text-xs text-blue-700 mt-1">
              You have the {userRole} role. Only company administrators or the
              owner can edit profile information.
            </p>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
      />

      {canEdit ? renderEditForm() : renderReadOnlyCard()}
    </div>
  );
}
