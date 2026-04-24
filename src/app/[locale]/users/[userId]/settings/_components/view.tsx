"use client";

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import Container from "@/src/components/UI/Container";
import { useTranslations } from "next-intl";
import ChangeAvatar from "./change-avatar";
import ChangeDefaultUserType from "./change-default-user-type";
import ChangePassword from "./change-password";
import ChangeUserName from "./change-user-name";
import { SettingsTab } from "./settings-tab";

const View = () => {
  const settingsTranslations = useTranslations("Settings");

  return (
    <Container>
      <div className={"w-full flex mt-4"}>
        <Tabs defaultValue="password" className="flex md:flex-row flex-col w-full gap-10">
          <TabsList className={"flex-col h-max gap-3 bg-transparent w-max"}>
            <SettingsTab value="password">{settingsTranslations("changePassword")}</SettingsTab>
            <SettingsTab value="avatar">{settingsTranslations("changeAvatar")}</SettingsTab>
            <SettingsTab value="name">{settingsTranslations("changeDisplayName")}</SettingsTab>
            <SettingsTab value="type">{settingsTranslations("changeDefaultLibraryType")}</SettingsTab>
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
