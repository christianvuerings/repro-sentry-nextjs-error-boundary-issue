"use client";

import { useEffect, type ReactElement } from "react";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string, __sentry_captured__?: boolean };
  reset: () => void;
}): ReactElement {
  console.log("///// captured before", error.__sentry_captured__);
	useEffect(() => {
    Sentry.captureException(error, {
      tags: {
        "cambly.captureLocation": "nextjsPageError",
      },
    });
  }, [error]);

  return (
    <h2>
      Something went wrong{" "}
      <button onClick={() => reset()} type="button">
        Reset
      </button>
    </h2>
  );
}
