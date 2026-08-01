import { Trash2, Plus, Minus } from "lucide-react";

export function CartCardNew({ title, price, quantity, image, addon }) {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm mb-4">
      <div className="flex gap-4">
        {/* Image */}
        <img
          src={image}
          alt={title}
          className="w-24 h-24 rounded-xl object-cover"
        />

        {/* Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h2 className="font-semibold text-lg text-gray-800">
              {title}
            </h2>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800">
                ₦{price?.toLocaleString()}
              </span>
              <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
            </div>
          </div>

          <p className="text-gray-600 text-sm mt-1">
            ₦{price?.toLocaleString()}
          </p>

          {/* Addon */}
          <div className="mt-3 border rounded-lg p-2 text-sm text-gray-500 flex justify-between">
            <span>{addon}</span>
            <span>⌄</span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">Addons</span>

            <div className="flex items-center gap-2">
              <button className="border rounded-lg p-1">
                <Minus size={16} />
              </button>
              <span className="px-2">{quantity}</span>
              <button className="border rounded-lg p-1">
                <Plus size={16} />
              </button>
              <button className="ml-2 border rounded-lg p-1">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
