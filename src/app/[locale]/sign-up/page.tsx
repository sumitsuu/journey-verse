import Container from "@/src/components/UI/Container";

import SignUpView from "./_components/sign-up-view";

const SignUpPage = () => {
  return (
    <Container className={"flex flex-col items-center justify-center flex-grow px-2 xl:px-0 animate-fadeIn"}>
      <SignUpView />
    </Container>
  );
};

export default SignUpPage;
