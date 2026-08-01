import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import axios from "axios";
import { api, useFingerprint } from "../utils/apiConfig";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function VendorRegistration(props) {
  const { setUploadOpen } = props;

  const [placesCanDeliverTo, setPlacesCanDeliverTo] = useState([]);
  const [businessImg, setBusinessImg] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const fingerprint = useFingerprint();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const check = () => setIsSmallScreen(window.innerWidth < 1000);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setBusinessImg(file);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreviewImage("");
    setBusinessImg(null);
  };

  const addPlace = () => {
    if (!newContent.trim()) return;
    setPlacesCanDeliverTo((prev) => [...prev, newContent.trim()]);
    setNewContent("");
  };

  const handleClose = () => {
    const params = new URLSearchParams(location.search);
    params.set("openUpload", "false");
    navigate({ search: params.toString() });
    setUploadOpen(false);
  };

  const handleUploadProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("businessImg", businessImg);
    formData.append("businessName", businessName);
    formData.append("physicalAddress", physicalAddress);
    formData.append(
      "placesCanDeliverTo",
      JSON.stringify(placesCanDeliverTo)
    );

    try {
      await axios.post(
        `${api}/api/users/vendor/${fingerprint}/registration/${userInfo?.user?._id}`,
        formData
      );

      setUploadOpen(false);
      navigate(`/profile/${userInfo?.user?._id}`);

      toast.success("Registration successful!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 md:p-8 relative">

  
        

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Vendor Registration
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Set up your store to start selling
        </p>

        <form onSubmit={handleUploadProduct} className="space-y-5">

          {/* Upload */}
          <div className="flex justify-center">
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-28 h-28 rounded-full border border-dashed flex items-center justify-center cursor-pointer relative overflow-hidden bg-gray-50"
            >
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    className="w-full h-full object-cover" alt=""
                  />
                  <div
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 text-xs">
                  <LibraryAddIcon />
                  <p>Upload shop photo</p>
                </div>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Inputs */}
          <div>
            <label className="text-sm font-medium">Shop Name</label>
            <Form.Control
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-1"
              placeholder="e.g Mama's Kitchen"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Physical Address</label>
            <Form.Control
              value={physicalAddress}
              onChange={(e) => setPhysicalAddress(e.target.value)}
              className="mt-1"
              placeholder="Enter shop location"
            />
          </div>

          {/* Delivery Areas */}
          <div>
            <label className="text-sm font-medium">
              Delivery Locations
            </label>

            <div className="mt-2 flex flex-wrap gap-2">
              {placesCanDeliverTo.map((place, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-xs px-2 py-1 rounded-full"
                >
                  {place}
                </span>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <Form.Control
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Add area"
              />
              <Button
                variant="success"
                onClick={addPlace}
                disabled={!newContent.trim()}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full py-2 rounded-xl font-semibold"
            variant="success"
          >
            Create Store
          </Button>
        </form>
      </div>
    </div>
  );
}

export default VendorRegistration;