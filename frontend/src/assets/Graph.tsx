import * as React from "react";

function Graph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={600}
      height={365}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 15C0 6.716 6.716 0 15 0h570c8.284 0 15 6.716 15 15v335c0 8.284-6.716 15-15 15H15c-8.284 0-15-6.716-15-15V15z"
        fill="#fff"
        fillOpacity={0.25}
      />
      <path
        d="M73.5 65v252M49 279h509M49 137h509M49 107h509M49 80h509M49 164h509M49 191h509M49 221h509M49 251h509M106.5 65v252M137.5 65v252M171.5 65v252M204.5 65v252M300.5 65v252M332.5 65v252M365.5 65v252M401.5 65v252M434.5 65v252M467.5 65v252M503.5 65v252M537.5 65v252M268.5 65v252M238.5 65v252"
        stroke="#FFFF"
        strokeOpacity={0.25}
        strokeWidth={2}
      />
      <path d="M45 52v261h513" stroke="#FFFF" strokeWidth={5} />
      <path
        d="M45 313l115.5-112 91.5 26.5 95.5-56 97 11L560 104"
        stroke="#FFFF"
        strokeWidth={5}
      />
      <circle cx={162} cy={202} r={7} fill="#D9D9D9" />
      <circle cx={350} cy={171} r={7} fill="#D9D9D9" />
      <circle cx={253} cy={228} r={7} fill="#D9D9D9" />
      <circle cx={444} cy={181} r={7} fill="#D9D9D9" />
    </svg>
  );
}

export default Graph;
