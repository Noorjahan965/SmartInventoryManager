import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

const BarCode = ({ value, width, height}) => {
  const ref = useRef(null);

  useEffect(() => {
    JsBarcode(ref.current, value, {
      format: "CODE128",
      width: width,
      height: height,   // 👈 IMPORTANT — controls SVG inner height
      displayValue: false,
    });
  }, [value]);

  return <svg ref={ref} ></svg>;
};

export default BarCode;
