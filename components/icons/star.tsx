export const Star = ({ className = "w-[24px] h-[24px]" }: { className?: string }) => {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        fill={"yellow"}
        d="M12 2.5l2.77 6.89 7.23.62-5.5 4.79 1.71 7.2L12 17.77 5.79 21.99l1.71-7.2-5.5-4.79 7.23-.62L12 2.5z"
      />
    </svg>
  );
};
