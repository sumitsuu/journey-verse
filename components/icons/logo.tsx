export const Logo = ({ className = "w-[200px] h-[50px] fill-white" }: { className?: string }) => {
  return (
    <svg className={`group ${className}`} viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="6" stroke="white" strokeWidth="2" fill="none" className={"duration-300"} />
      <ellipse
        cx="25"
        cy="25"
        rx="12"
        ry="6"
        stroke="white"
        strokeWidth="1"
        fill="none"
        opacity="0.7"
        className={"duration-300"}
      />
      <ellipse
        cx="25"
        cy="25"
        rx="18"
        ry="9"
        stroke="white"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
        className={"duration-300"}
      />

      <text x="60" y="32" fontSize="20" fill="white" fontWeight="bold" className={"duration-300"}>
        JourneyVerse
      </text>
    </svg>
  );
};
