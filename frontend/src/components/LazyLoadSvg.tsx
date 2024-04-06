/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";

export type LazyLoadSVGProps =
  | {
      path: string;
      fullPath?: undefined;
      style?: React.CSSProperties;
      className?: string;
      fallback?: React.ReactElement;
    }
  | {
      path?: undefined;
      fullPath: string;
      style?: React.CSSProperties;
      className?: string;
      fallback?: React.ReactElement;
    };

const LazyLoadSVG: React.FC<LazyLoadSVGProps> = ({
  path,
  fullPath,
  style,
  className,
  fallback = null,
}) => {
  const ref = useRef<React.JSXElementConstructor<any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
  }, [path, fullPath]);

  useEffect(() => {
    const getSvg = async () => {
      try {
        if (fullPath) {
          console.log(fullPath);
          const icon = await import(`${fullPath}`);
          ref.current =
            icon.default as unknown as React.JSXElementConstructor<any>;
          setLoading(false);
        } else {
          const icon = await import(`./frontend${path}`);
          ref.current =
            icon.default as unknown as React.JSXElementConstructor<any>;
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        ref.current = null;
        setLoading(false);
      }
    };
    if (loading) {
      getSvg();
    }
  }, [path, fullPath, loading]);

  if (ref.current) {
    const SVG = ref.current;
    return (
      <div style={{ display: "flex", ...style }} className={className}>
        <SVG />
      </div>
    );
  }

  return fallback;
};

export default LazyLoadSVG;
