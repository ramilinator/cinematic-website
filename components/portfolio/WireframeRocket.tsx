"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

export type WireframeRocketHandle = {
  element: HTMLDivElement | null;
};

type WireframeRocketProps = {
  className?: string;
};

const WireframeRocket = forwardRef<WireframeRocketHandle, WireframeRocketProps>(
  ({ className = "" }, ref) => {
    const rootRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      element: rootRef.current,
    }));

    return (
      <div
        ref={rootRef}
        className={`relative w-[420px] aspect-square ${className}`}
      >
        <svg
          viewBox="0 0 500 500"
          className="h-full w-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* =====================================================
            ROCKET BODY
        ====================================================== */}

          {/* Main outer body */}
          <path
            d="
            M250 55
            C218 85 190 135 177 205
            L177 335
            C177 370 205 407 250 438
            C295 407 323 370 323 335
            L323 205
            C310 135 282 85 250 55
            Z
          "
            stroke="currentColor"
            strokeWidth="1.5"
          />

          {/* Center body line */}
          <path
            d="M250 55V438"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.45"
          />

          {/* Nose construction */}
          <path
            d="M250 55L205 155"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.65"
          />

          <path
            d="M250 55L295 155"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.65"
          />

          {/* =====================================================
            COCKPIT / CENTER DETAIL
        ====================================================== */}

          <ellipse
            cx="250"
            cy="174"
            rx="43"
            ry="58"
            stroke="currentColor"
            strokeWidth="1.4"
          />

          <ellipse
            cx="250"
            cy="174"
            rx="27"
            ry="43"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Cockpit center */}
          <path
            d="M250 116V232"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.35"
          />

          <path
            d="M207 174H293"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.35"
          />

          {/* =====================================================
            BODY SECTION LINES
        ====================================================== */}

          <path
            d="M183 255H317"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.45"
          />

          <path
            d="M180 292H320"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.35"
          />

          <path
            d="M180 335H320"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.45"
          />

          {/* =====================================================
            LEFT FIN
        ====================================================== */}

          <path
            d="
            M180 265
            L125 345
            L177 330
            Z
          "
            stroke="currentColor"
            strokeWidth="1.5"
          />

          <path
            d="M180 280L140 338"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* =====================================================
            RIGHT FIN
        ====================================================== */}

          <path
            d="
            M320 265
            L375 345
            L323 330
            Z
          "
            stroke="currentColor"
            strokeWidth="1.5"
          />

          <path
            d="M320 280L360 338"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* =====================================================
            ENGINE SECTION
        ====================================================== */}

          <path d="M198 360H302" stroke="currentColor" strokeWidth="1.5" />

          {/* Left engine */}
          <path
            d="
            M202 360
            L202 405
            L225 425
            L225 360
            Z
          "
            stroke="currentColor"
            strokeWidth="1.4"
          />

          {/* Center engine */}
          <path
            d="
            M235 360
            L235 420
            L250 438
            L265 420
            L265 360
            Z
          "
            stroke="currentColor"
            strokeWidth="1.4"
          />

          {/* Right engine */}
          <path
            d="
            M275 360
            L275 425
            L298 405
            L298 360
            Z
          "
            stroke="currentColor"
            strokeWidth="1.4"
          />

          {/* =====================================================
            ENGINE INTERNAL LINES
        ====================================================== */}

          <path
            d="M208 378H219"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />

          <path
            d="M208 391H219"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />

          <path
            d="M242 378H258"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />

          <path
            d="M242 392H258"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />

          <path
            d="M281 378H292"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />

          <path
            d="M281 391H292"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* =====================================================
            SMALL TECHNICAL DETAILS
        ====================================================== */}

          <circle
            cx="250"
            cy="270"
            r="5"
            stroke="currentColor"
            strokeWidth="1"
          />

          <circle cx="250" cy="270" r="2" fill="currentColor" />

          <path
            d="M215 310H285"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* =====================================================
            CONSTRUCTION GUIDES
        ====================================================== */}

          <path
            d="M150 174H190"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.2"
          />

          <path
            d="M310 174H350"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.2"
          />

          <path
            d="M145 270H185"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.2"
          />

          <path
            d="M315 270H355"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.2"
          />
        </svg>
      </div>
    );
  },
);

WireframeRocket.displayName = "WireframeRocket";

export default WireframeRocket;
