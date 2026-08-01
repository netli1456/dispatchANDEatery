import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shippingSuccess } from "../redux/shippingSlice";
import { toast } from "react-toastify";
import { X } from "lucide-react";

export default function ShippingNew({ setShipOpen }) {
  const { shipping } = useSelector((state) => state.shippingAddress);

  const [form, setForm] = useState({
    name: shipping?.name || "",
    street: shipping?.street || "",
    localGvt: shipping?.localGvt || "",
    state: shipping?.state || "",
    country: shipping?.country || "",
    phoneNumber: shipping?.phoneNumber || "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleShipping = (e) => {
    e.preventDefault();

    const { name, street, localGvt, state, country, phoneNumber } = form;

    if (!name || !street || !localGvt || !state || !country || !phoneNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(shippingSuccess(form));
    setShipOpen(false);
    toast.success("Shipping Info Updated");
  };

  return (
    <div className="fixed mt-14 inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={() => setShipOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Delivery Address
          </h2>
          <p className="text-gray-500 text-sm">
            Enter where you want your food delivered
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleShipping} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="John Doe"
            />
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              value={form.street}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="No 15, Ikoyi Crescent"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LGA
              </label>
              <input
                type="text"
                name="localGvt"
                value={form.localGvt}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="Eti-Osa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="Lagos"
              />
            </div>
          </div>

          {/* Country + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="Nigeria"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="08012345678"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShipOpen(false)}
              className="px-4 py-2 rounded-xl border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
