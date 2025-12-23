"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangeAvatar from "@/src/app/users/[userId]/settings/_components/change-avatar";
import ChangeDefaultUserType from "@/src/app/users/[userId]/settings/_components/change-default-user-type";
import ChangePassword from "@/src/app/users/[userId]/settings/_components/change-password";
import ChangeUserName from "@/src/app/users/[userId]/settings/_components/change-user-name";
import Container from "@/src/components/UI/Container";

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
