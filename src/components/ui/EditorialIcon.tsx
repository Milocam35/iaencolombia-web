import type { SVGProps } from "react";
export function EditorialIcon({
  name,
  ...props
}: {
  name:
    | "person"
    | "company"
    | "institution"
    | "book"
    | "people"
    | "spark"
    | "search"
    | "link";
} & SVGProps<SVGSVGElement>) {
  const paths = {
    person: (
      <>
        <circle cx="12" cy="7" r="3" />
        <path d="M5 21v-3a7 7 0 0 1 14 0v3Z" />
      </>
    ),
    company: (
      <>
        <path d="M4 21V5h10v16M14 10h6v11M2 21h20M7 8h4M7 12h4M7 16h4M17 13v2M17 18v2" />
      </>
    ),
    institution: (
      <>
        <path d="m2 8 10-6 10 6H2Zm2 3v7m5-7v7m6-7v7m5-7v7M2 21h20M3 18h18" />
      </>
    ),
    book: (
      <>
        <path d="M12 5c-3-2-7-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 1Zm0 0v15" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M2 21v-3a7 7 0 0 1 14 0v3M17 4a3 3 0 0 1 0 6m2 3a6 6 0 0 1 3 5v3" />
      </>
    ),
    spark: (
      <>
        <path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2Z" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    link: (
      <>
        <path
          d="m9 15 6-6M7 17l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 10a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-1 1"
          transform="translate(1 0) scale(.9 1)"
        />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
