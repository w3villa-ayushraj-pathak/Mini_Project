import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, faPhone, faCamera, faUserPen, faSpinner, 
  faAddressCard, faGlobe, faCity, faSearch, faQuoteLeft, faMapPin
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getProfile, updateProfile, uploadProfileImage, downloadMyDetails } from "../../services/profile.service";
import { updateUserAddress } from "../../services/map.service";

// Fix Leaflet Marker Assets
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Dynamic Map View Controller Component
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center?.[0] != null && center?.[1] != null) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
}

function Profile() {
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    address: {
      fullAddress: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      lat: null,
      lng: null,
    },
  });

  const handleDownloadDetails = async () => {

  try {

    const response =
      await downloadMyDetails();

    const blob = new Blob(
      [response.data],
      {
        type: "application/pdf",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = "my-account-details.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success(
      "Details downloaded successfully"
    );

  } catch (error) {

    toast.error(
      "Failed to download details"
    );

  }

};

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await getProfile();
      const user = response.data.user;
      const address = user.address || {};

      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        address: {
          fullAddress: address.fullAddress || "",
          city: address.city || "",
          state: address.state || "",
          country: address.country || "",
          postalCode: address.postalCode || "",
          lat: address.lat ?? null,
          lng: address.lng ?? null,
        },
      });

      setPreview(user.profileImage?.url || "");
      if (address.fullAddress) setSearchQuery(address.fullAddress);
      if (address.lat != null && address.lng != null) {
        setMapCenter([address.lat, address.lng]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile parameters");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleGeocodeAddress = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return toast.error("Please enter an address location");

    try {
      setMapLoading(true);
      const response = await updateUserAddress(searchQuery.trim());
      const address = response.data;

      if (address.lat == null || address.lng == null) {
        return toast.error("Coordinates unresolved on map clusters");
      }

      setFormData((prev) => ({
        ...prev,
        address: {
          fullAddress: address.fullAddress || searchQuery,
          city: address.city || "",
          state: address.state || "",
          country: address.country || "",
          postalCode: address.postalCode || "",
          lat: address.lat,
          lng: address.lng,
        },
      }));

      setSearchQuery(address.fullAddress || searchQuery);
      setMapCenter([address.lat, address.lng]);
      toast.success("Address verified and geo-mapped successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not resolve geographic address text");
    } finally {
      setMapLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageLoading(true);
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      const response = await uploadProfileImage(file);
      toast.success(response.message || "Profile avatar uploaded successfully");
      await fetchProfile();
      URL.revokeObjectURL(localPreview);
    } catch (error) {
      toast.error(error.response?.data?.message || "Image pipeline transmission failed");
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
      };
      const response = await updateProfile(payload);
      toast.success(response.message || "Core identity configurations saved");
      await fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to finalize profile changes");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans select-none relative overflow-hidden">
        <div className="relative h-12 w-12 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
          <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative flex flex-col">
      {/* Immersive Structural Blur Accents */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Navbar />

      <div className="flex flex-col md:flex-row flex-1 relative z-10 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col gap-y-8 overflow-hidden">
          {/* Header Section */}
          <header className="border-b border-zinc-900 pb-6 flex items-center gap-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
              <FontAwesomeIcon icon={faUserPen} className="text-sm" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Profile Configuration
                </h1>

                <p className="text-zinc-500 text-xs sm:text-sm mt-0.5 font-medium tracking-wide">
                  Calibrate framework credentials, biographical details, and map telemetry fields.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadDetails}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-bold transition-all duration-200 shadow-lg shadow-emerald-500/10 active:scale-[0.98] cursor-pointer"
              >
                Download My Details
              </button>
            </div>
          </header>

          {/* Form Configuration Center */}
          <div className="max-w-3xl w-full bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
              
              {/* Profile Avatar Canvas Integration */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-zinc-900">
                <div className="relative group shrink-0">
                  <div className="relative h-24 w-24 sm:h-26 sm:w-26 rounded-2xl bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center overflow-hidden shadow-inner transition-all duration-300 group-hover:border-emerald-500/50">
                    {preview ? (
                      <img src={preview} alt="Profile Avatar" className="object-cover w-full h-full" />
                    ) : (
                      <FontAwesomeIcon icon={faUser} className="text-zinc-600 text-3xl" />
                    )}
                    {imageLoading && (
                      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-emerald-400 text-lg" />
                      </div>
                    )}
                  </div>
                  <label htmlFor="profile-image" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center justify-center shadow-lg transition-transform duration-250 hover:scale-105 cursor-pointer">
                    <FontAwesomeIcon icon={faCamera} className="text-xs" />
                  </label>
                  <input id="profile-image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={imageLoading} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-sm font-bold text-zinc-300 tracking-wide">Identity Avatar Node</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                    Updates sync automatically via asset buffers directly into secure Cloudinary store containers.
                  </p>
                </div>
              </div>

              {/* Core Attributes Grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-y-1.5">
                  <label className="text-zinc-400 text-xs font-semibold tracking-wider uppercase pl-1">Display Name</label>
                  <div className="relative flex items-center group">
                    <FontAwesomeIcon icon={faUser} className="absolute left-4 text-zinc-500 text-sm group-focus-within:text-emerald-400 transition-colors" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Required" required className="w-full outline-none bg-zinc-900/30 border border-zinc-800/80 text-zinc-100 pl-11 pr-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all focus:border-emerald-500 focus:bg-zinc-900/60" />
                  </div>
                </div>

                <div className="flex flex-col gap-y-1.5">
                  <label className="text-zinc-400 text-xs font-semibold tracking-wider uppercase pl-1">Phone String</label>
                  <div className="relative flex items-center group">
                    <FontAwesomeIcon icon={faPhone} className="absolute left-4 text-zinc-500 text-sm group-focus-within:text-emerald-400 transition-colors" />
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="0123456789" className="w-full outline-none bg-zinc-900/30 border border-zinc-800/80 text-zinc-100 pl-11 pr-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all focus:border-emerald-500 focus:bg-zinc-900/60" />
                  </div>
                </div>
              </div>

              {/* Bio Summary Field */}
              <div className="flex flex-col gap-y-1.5">
                <label className="text-zinc-400 text-xs font-semibold tracking-wider uppercase pl-1">Biographical Telemetry</label>
                <div className="relative flex items-start group">
                  <FontAwesomeIcon icon={faQuoteLeft} className="absolute left-4 top-3.5 text-zinc-500 text-xs group-focus-within:text-emerald-400 transition-colors" />
                  <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Detail your computational learning roadmap paths..." rows={3} className="w-full outline-none bg-zinc-900/30 border border-zinc-800/80 text-zinc-100 pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all focus:border-emerald-500 focus:bg-zinc-900/60 resize-none" />
                </div>
              </div>

              {/* Map Geocoding Input Panel */}
              <div className="flex flex-col gap-y-4 pt-4 border-t border-zinc-900/60">
                <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-x-2">
                  <FontAwesomeIcon icon={faAddressCard} className="text-emerald-400 text-xs" />
                  <span>Geographic Targeting Node</span>
                </h3>

                <div className="flex gap-2">
                  <div className="relative flex items-center flex-1 group">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 text-zinc-500 text-xs group-focus-within:text-emerald-400 transition-colors" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search location (e.g., Sector 62, Noida, UP)" className="w-full outline-none bg-zinc-900/30 border border-zinc-800/80 text-zinc-100 pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all focus:border-emerald-500 focus:bg-zinc-900/60" />
                  </div>
                  <button type="button" onClick={handleGeocodeAddress} disabled={mapLoading} className="bg-zinc-900 hover:bg-emerald-500 border border-zinc-800 hover:border-emerald-400 text-zinc-300 hover:text-zinc-950 font-bold text-xs px-5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40 shadow-inner flex items-center justify-center">
                    {mapLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" /> : "Verify Vector"}
                  </button>
                </div>

                {/* Leaflet Canvas Container wrapper */}
                <div className="h-64 w-full rounded-2xl overflow-hidden border border-zinc-850/80 shadow-inner relative z-0">
                  <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>' />
                    <ChangeMapView center={mapCenter} />
                    {formData.address.lat != null && formData.address.lng != null && (
                      <Marker position={[formData.address.lat, formData.address.lng]} />
                    )}
                  </MapContainer>
                </div>

                {/* Read Only Response Field Matrices */}
                <div className="flex flex-col gap-y-4 mt-1 bg-zinc-900/10 border border-zinc-900 p-4 rounded-2xl">
                  <div className="flex flex-col gap-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-bold tracking-wider uppercase pl-1">Resolved Destination String</label>
                    <div className="relative flex items-center">
                      <FontAwesomeIcon icon={faMapPin} className="absolute left-4 text-zinc-600 text-xs" />
                      <input type="text" value={formData.address.fullAddress} readOnly placeholder="Awaiting verified coordinate indexing..." className="w-full outline-none bg-zinc-950/40 border border-zinc-900 text-zinc-400 pl-10 pr-4 py-2 rounded-xl text-xs font-medium font-sans select-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="flex flex-col"><span className="text-[10px] text-zinc-600 font-bold uppercase pl-0.5">City</span><input type="text" value={formData.address.city} readOnly className="mt-1 outline-none bg-zinc-950/40 border border-zinc-900 text-zinc-400 px-3 py-1.5 rounded-lg text-xs" /></div>
                    <div className="flex flex-col"><span className="text-[10px] text-zinc-600 font-bold uppercase pl-0.5">State</span><input type="text" value={formData.address.state} readOnly className="mt-1 outline-none bg-zinc-950/40 border border-zinc-900 text-zinc-400 px-3 py-1.5 rounded-lg text-xs" /></div>
                    <div className="flex flex-col"><span className="text-[10px] text-zinc-600 font-bold uppercase pl-0.5">Country</span><input type="text" value={formData.address.country} readOnly className="mt-1 outline-none bg-zinc-950/40 border border-zinc-900 text-zinc-400 px-3 py-1.5 rounded-lg text-xs" /></div>
                    <div className="flex flex-col"><span className="text-[10px] text-zinc-600 font-bold uppercase pl-0.5">Postal Vector</span><input type="text" value={formData.address.postalCode} readOnly className="mt-1 outline-none bg-zinc-950/40 border border-zinc-900 text-zinc-400 px-3 py-1.5 rounded-lg text-xs font-mono" /></div>
                  </div>
                </div>
              </div>

              {/* Master Form Configuration Submit Element */}
              <div className="flex justify-end pt-4 border-t border-zinc-900/60 mt-2">
                <button type="submit" disabled={loading} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold rounded-xl px-6 py-3 text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-x-2 cursor-pointer">
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                      <span>Commiting Dynamic Changes...</span>
                    </>
                  ) : (
                    "Save Configuration Profiles"
                  )}
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;