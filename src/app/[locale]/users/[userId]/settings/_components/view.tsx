"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/src/components/UI/Container";
import ChangeAvatar from "./change-avatar";
import ChangeDefaultUserType from "./change-default-user-type";
import ChangePassword from "./change-password";
import ChangeUserName from "./change-user-name";

const View = () => {
  return (
    <Container>
      <div className={"w-full flex mt-4"}>
        <Tabs defaultValue="password" className="flex md:flex-row flex-col w-full gap-10">
          <TabsList className={"flex-col h-max gap-3 bg-transparent w-max"}>
            <TabsTrigger value="password" className={"justify-start w-full shadow-none rounded-[12px] bg-transparent"}>
              Change Password
            </TabsTrigger>
            <TabsTrigger value="avatar" className={"justify-start w-full shadow-none rounded-[12px] bg-transparent"}>
              Change Avatar
            </TabsTrigger>
            <TabsTrigger value="name" className={"justify-start w-full shadow-none rounded-[12px] bg-transparent"}>
              Change Display Name
            </TabsTrigger>
            <TabsTrigger value="type" className={"justify-start w-full shadow-none rounded-[12px] bg-transparent"}>
              Change Default Library Type
            </TabsTrigger>
          </TabsList>
          <TabsContent value="password" className={"w-full"}>
            <ChangePassword />
          </TabsContent>
          <TabsContent value="avatar">
            <ChangeAvatar />
          </TabsContent>
          <TabsContent value="name">
            <ChangeUserName />
          </TabsContent>
          <TabsContent value="type">
            <ChangeDefaultUserType />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default View;
