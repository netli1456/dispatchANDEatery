export default function Section({ kitchenData, title, items, addToCart, cols="grid-cols-3" }) {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-sm text-green-600 cursor-pointer">View all</span>
      </div>
      <div className={`grid ${cols} gap-4`}>
        {kitchenData.map((item) => (
          <div key={item.name} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img src={item.img} className="h-32 w-full object-cover" alt=""/>
            <div className="p-3">
              <p className="text-sm font-medium">{item.name}</p>
              {item.desc && <p className="text-xs text-gray-500">{item.desc}</p>}
              <p className="text-green-600 font-semibold text-sm mt-1">₦{item.price}</p>
              <button onClick={() => addToCart(item)} className="mt-2 w-full bg-green-600 text-white py-1 rounded-lg text-sm">Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
