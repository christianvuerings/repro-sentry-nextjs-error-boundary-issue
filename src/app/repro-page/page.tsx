"use client";

import { useSearchParams } from "next/navigation";

export default function Page() {
  const throwErrorIntentionally = useSearchParams().get("throwErrorIntentionally");
  if (throwErrorIntentionally === "true") {
    console.log("Node environment: ", process.env.NODE_ENV);
    throw new Error("PROD_CUSTOM_ERROR_ABCD_1234");
  }

  return (
   <h1>Test</h1>
  );
}
