"use client";

import Container from "@/src/components/UI/Container";
import LeftSide from "./left-side";
import RightSide from "./right-side";

const View = () => {
  return (
    <Container className={"flex lg:px-8 xl:gap-10 gap-8 py-8 lg:flex-row flex-col"}>
      <>
        <LeftSide />
        <RightSide />
      </>
    </Container>
  );
};

export default View;
