## Rules

- Use `pnpm`
- This project is using shadcn/ui. Read: https://ui.shadcn.com/llms.txt
- Talk to me in English

### Rules for writing TypeScript Code

- Use `date-fns` for anything related to date. Including date formatting, and checking if a date is in the past or future.
- Don't cast types. For example: `something as Something`. Especially `as any` and `as unknown`. Instead, create a new variable with the correct type.
- On writing function, prefer arrow functions. For example: `const myFunction = () => {}` instead of `function myFunction() {}`.
- For checking array length, prefer `array.length` instead of `array.length !== 0` or `array.length > 0`.
- When using `useEffect`, always add the dependency array (even it's an empty array).
- When using `useEffect`, DO NOT PUT FUNCTIONS INSIDE THE DEPENDENCY ARRAY, even if the function is called inside the `useEffect`.
- Prefer import `React` (so usage becomes like this: `React.useSomething`) than import the function like this `import React, { createContext, useState, useEffect } from "react";`
- Use `@tanstack/react-query`'s `useQuery` and `useMutation` for any API calls

### Rules for Comments & Documentations

- don't add comments in code at all, I'll ask you to add comments if I need it
- for docs, always answer in markdown format
- don't use any emojis, and don't use any markdown styling (bold, italic, etc)
- keep it brief, short, but cover the details needed
