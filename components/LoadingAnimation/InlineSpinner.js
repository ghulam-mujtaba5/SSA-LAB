import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

const LoadingAnimation = dynamic(
  () => import("./LoadingAnimation"),
  { ssr: false }
);

/**
 * InlineSpinner
 * A tiny preset for inline usage of the LoadingAnimation (ring variant).
 */
const InlineSpinner = ({ sizePx = 16, ariaHidden = true, className, style }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden={ariaHidden}
        className={className}
        style={{
          display: "inline-block",
          width: sizePx,
          height: sizePx,
          border: "2px solid currentColor",
          borderTopColor: "transparent",
          borderRadius: "50%",
          boxSizing: "border-box",
          ...style,
        }}
      />
    );
  }

  const spinner = (
    <LoadingAnimation
      visible
      fullscreen={false}
      variant="ring"
      sizePx={sizePx}
      showStars={false}
    />
  );

  if (ariaHidden) {
    return (
      <span aria-hidden="true" className={className} style={style}>
        {spinner}
      </span>
    );
  }
  return (
    <span className={className} style={style}>
      {spinner}
    </span>
  );
};

export default InlineSpinner;
