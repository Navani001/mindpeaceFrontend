"use client";

import { useState } from "react";

export function CollaborativeEditor() {
  const [value, setValue] = useState("");

  return (
    <div className="h-full w-full p-4">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Start typing your notes..."
        className="h-full w-full resize-none rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900 outline-none focus:border-blue-500"
      />
    </div>
  );
}
