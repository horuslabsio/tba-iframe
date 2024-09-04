import * as React from "react";
import { SVGProps } from "react";

export const TBALogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={15}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeOpacity={0.7}
      strokeWidth={2.075}
      d="M6.413 5.226a1.872 1.872 0 0 0-.234 3.737c1.364.065 2.401-1.813 2.728-2.448.327-.635 1.411-3.27.355-4.307C7.982.956 4.357 1.423 2.61 3.516c-2.261 2.69-1.374 8.082 1.71 9.287 2.457.935 6.241-.757 7.68-4.672"
    />
  </svg>
);

export const NotificationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 2"
    viewBox="0 0 26.23 26.23"
    {...props}
  >
    <g data-name="Layer 1">
      <path
        fill="#ff8a00"
        d="M13.12 0C11.4 0 9.69.34 8.1 1c-1.59.66-3.04 1.63-4.26 2.84C1.38 6.3 0 9.64 0 13.12s1.38 6.82 3.84 9.28c1.22 1.22 2.66 2.18 4.26 2.84a13.124 13.124 0 0 0 14.3-2.84 13.124 13.124 0 0 0 2.84-14.3c-.66-1.59-1.63-3.04-2.84-4.26A13.038 13.038 0 0 0 18.14 1c-1.59-.66-3.3-1-5.02-1Z"
      />
      <g fill="#fff">
        <path d="M11.81 6.56h2.62v7.87h-2.62zM11.81 17.05h2.62v2.62h-2.62z" />
      </g>
    </g>
  </svg>
);

export const HambugerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    stroke="#A1A1AA"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-external-link"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
  </svg>
);

export const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
  </svg>
);
