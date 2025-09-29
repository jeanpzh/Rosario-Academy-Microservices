import React from "react";
import VolleyballLoader from "./loader";
export default function LoadingPage() {
  return (
    <div className={"flex h-screen items-center justify-center"}>
      <VolleyballLoader size="medium" />
    </div>
  );
}
