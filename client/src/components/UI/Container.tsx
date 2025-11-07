import { ReactElement } from "react";

type ContainerProps = {
  children: ReactElement;
  extraClasses?: any;
  className?: string;
  [k: string]: any;
};

function Container({ children, extraClasses, className }: Readonly<ContainerProps>) {
  return (
    <div className={`w-full mt-0 mx-auto xl:px-0 px-5 container h-full ${extraClasses} ${className}`}>{children}</div>
  );
}

export default Container;
