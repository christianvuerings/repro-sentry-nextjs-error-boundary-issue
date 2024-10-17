## To repro

### Create a new Next.js app
`npx create-next-app@latest repro-sentry-nextjs-error-boundary-issue`

### Install @sentry/nextjs
`npx @sentry/wizard@latest -i nextjs --saas --org cambly-inc --project sentry-repro-temp`

### Update all `sentry.*.config.ts` files

Add `debug: true` to be able to see the debug logs. Fixes `sdk.js:33 [Sentry] Cannot initialize SDK with debug option using a non-debug bundle.`

### Set `disableLogger: false` in `next.config.mjs`

To see the logs in the console

### Create `repro-page/page.tsx`

```ts
"use client";

import { type ReactElement } from "react";
import { useSearchParams } from "next/navigation";

export default function Page(): ReactElement {

  const throwErrorIntentionally = useSearchParams().get("throwErrorIntentionally");
  if (throwErrorIntentionally === "true") {
    throw new Error("TEST_ERROR_DEFG_1234");
  }

  return (
   <h1>Test</h1>
  );
}
```

### Create Nextjs Error Boundary: `app/error.tsx`

```ts
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
```

### Run the app in production mode

```
npm run build
npm run start
```

### Open the app in the browser

`http://localhost:3000/repro-page?throwErrorIntentionally=true`

### See the error in Sentry

Go to https://cambly-inc.sentry.io/issues/5998636590/?project=4508137977610240&referrer=project-issue-stream

(Example with `npm run dev`: https://cambly-inc.sentry.io/issues/5998636590/?project=4508137977610240&referrer=project-issue-stream)

## Expected behavior

The error should include `cambly.captureLocation` tag with value `nextjsPageError`.

## Actual behavior

The error does not include `cambly.captureLocation` tag.

