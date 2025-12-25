"use client";

import Container from "@/src/components/UI/Container";
import UserArtsInfo from "./user-arts-info";
import UserInfo from "./user-info";

const View = () => {
  return (
    <Container className={"flex lg:px-8 xl:gap-10 gap-8 py-8 lg:flex-row flex-col"}>
      <>
        <UserInfo />
        <UserArtsInfo />
      </>
    </Container>
  );
};

export default View;
