import { useState } from "react";

export default function DragDropDemo() {
  const [droppedProduct, setDroppedProduct] = useState(null);

  const product = {
    sno: 123,
    name: "iPhone 15 Pro Max",
    price: 159000
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const json = e.dataTransfer.getData("application/json");
    const obj = JSON.parse(json);     // convert back to JS object
    setDroppedProduct(obj);
    console.log("Dropped Product:", obj);
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <div className="p-5 space-y-5">
      {/* DROP TARGET */}
      <div
        onDrop={handleDrop}
        onDragOver={allowDrop}
        className="w-64 h-32 border-2 border-dashed border-red-500 rounded flex items-center justify-center"
      >
        Drop Here
      </div>

      {/* DRAG ITEM */}
      <div
        draggable
        onDragStart={(e) =>
          e.dataTransfer.setData("application/json", JSON.stringify(product))
        }
        className="w-48 p-3 bg-blue-500 text-white rounded cursor-move"
      >
        Drag Product
      </div>

      {/* SHOW RESULT */}
      {droppedProduct && (
        <div className="p-3 bg-green-100 rounded">
          <p><strong>Sno:</strong> {droppedProduct.sno}</p>
          <p><strong>Name:</strong> {droppedProduct.name}</p>
          <p><strong>Price:</strong> ₹{droppedProduct.price}</p>
        </div>
      )}
    </div>
  );
}
