import Container from "@/src/components/UI/Container";

import SignInView from "./_components/sign-in-view";

const LoginPage = () => {
  return (
    <Container className={"flex flex-col items-center justify-center flex-grow animate-fadeIn xl:px-0 px-2"}>
      <SignInView />
    </Container>
  );
};

export default LoginPage;
