import { useId, type SVGProps } from "react";

export function AdsMark({ ...props }: SVGProps<SVGSVGElement>) {
  const id = useId();
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 130 108"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M40.3555 96.1025L42.6787 107.46L0 57.498L6.90234 55.9814L40.3555 96.1025ZM129.565 49.9619L127.887 57.3125L76.1172 68.6924L77.7959 61.3418L122.662 51.4795L89.209 11.3584L42.6797 107.46L40.3555 96.1025L86.8857 0L129.565 49.9619ZM51.7695 46.1182L0 57.498L1.67871 50.1475L53.4482 38.7676L51.7695 46.1182Z"
        fill={`url(#${id})`}
      />
      <defs>
        <linearGradient
          id={id}
          x1="-1.00208e-06"
          y1="53.1553"
          x2="129.093"
          y2="53.1553"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3C6597" />
          <stop offset="0.25" stopColor="#61AD9E" />
          <stop offset="0.5" stopColor="#F2BA5E" />
          <stop offset="0.75" stopColor="#E2815A" />
          <stop offset="1" stopColor="#DF5B5B" />
        </linearGradient>
      </defs>
    </svg>
  );
}
export function Arrow({
  diagonal = false,
  ...props
}: SVGProps<SVGSVGElement> & { diagonal?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}
export function Spark({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <path
        d="M32 2v60M2 32h60M11 11l42 42M11 53l42-42"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}
export function LocationIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
export function CalendarIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 10h16M8 2v6m8-6v6" />
    </svg>
  );
}
