import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

export default function Barcode({ value }) {
  const ref = useRef(null);

  useEffect(() => {
    JsBarcode(ref.current, value, { format: "CODE128" });
  }, [value]);

  return <svg ref={ref}></svg>;
}
