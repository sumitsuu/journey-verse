"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { Link, useRouter } from "@/src/i18n/routing";
import { patchUserAdminAction } from "@/src/lib/actions/admin/patch-user-admin.action";
import { setUserRolesAction } from "@/src/lib/actions/admin/set-user-roles.action";
import type { FindRolesOutput } from "@/src/lib/services/role/find-roles.service";
import type { FindUsersOutput, FindUsersPageOutput } from "@/src/lib/services/user/find-users.service";
import { getFileUrl } from "@/src/lib/utils/file-url";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionHeader } from "@/src/app/[locale]/admin/create-art/_components/section-header";

type UserManagementViewProps = {
  initialSearch: string;
  roleCatalog: FindRolesOutput[];
  usersPage: FindUsersPageOutput;
};

export const UserManagementView = ({ initialSearch, roleCatalog, usersPage }: UserManagementViewProps) => {
  const t = useTranslations("Admin.userManagement");
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<FindUsersOutput | null>(null);
  const [sheetEmail, setSheetEmail] = useState("");
  const [sheetDisplayName, setSheetDisplayName] = useState("");
  const [sheetRoles, setSheetRoles] = useState<string[]>([]);

  const page = usersPage.page;
  const pageSize = usersPage.pageSize;
  const total = usersPage.total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const querySuffix = useMemo(() => {
    const parts = new URLSearchParams();
    if (initialSearch) {
      parts.set("q", initialSearch);
    }
    const s = parts.toString();
    return s ? `&${s}` : "";
  }, [initialSearch]);

  const openSheet = (user: FindUsersOutput) => {
    setActiveUser(user);
    setSheetEmail(user.email);
    setSheetDisplayName(user.displayName);
    setSheetRoles([...user.roles]);
  };

  const closeSheet = () => {
    setActiveUser(null);
  };

  const toggleRole = (name: string) => {
    setSheetRoles((prev) => (prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!activeUser) {
        return;
      }
      await patchUserAdminAction({
        id: activeUser.id,
        email: sheetEmail.trim(),
        displayName: sheetDisplayName.trim(),
      });
      await setUserRolesAction({ userId: activeUser.id, roleNames: sheetRoles });
    },
    onSuccess: () => {
      toast({ title: t("messages.saveSuccess") });
      closeSheet();
      router.refresh();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: t("messages.saveError"),
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          icon={<UsersRound className="size-5" />}
          title={t("title")}
          description={t("description")}
        />
        <form method="get" className="flex w-full max-w-md gap-2 lg:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={initialSearch}
              placeholder={t("searchPlaceholder")}
              className="pl-9"
              aria-label={t("searchPlaceholder")}
            />
          </div>
          <Button type="submit" variant="secondary">
            {t("search")}
          </Button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card/30">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/20">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("columns.user")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("columns.email")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("columns.roles")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {usersPage.items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-16 text-center text-muted-foreground">
                    {t("empty")}
                  </td>
                </tr>
              ) : (
                usersPage.items.map((user) => (
                  <tr key={user.id} className="border-b border-border/40 last:border-0 hover:bg-muted/10">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 border border-border/60">
                          <AvatarImage src={user.avatarPath ? getFileUrl(user.avatarPath) : ""} />
                          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                            {user.displayName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">{user.displayName}</p>
                          <p className="truncate text-xs text-muted-foreground">ID {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length === 0 ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          user.roles.map((role) => (
                            <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>
                              {role}
                            </Badge>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button type="button" size="sm" variant="outline" onClick={() => openSheet(user)}>
                        {t("manage")}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t("pagination.summary", { from: (page - 1) * pageSize + 1, to: Math.min(page * pageSize, total), total })}
          </p>
          <div className="flex items-center gap-2">
            {page <= 1 ? (
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="size-4" />
              </Button>
            ) : (
              <Button variant="outline" size="icon" asChild>
                <Link href={`/admin/user-management?page=${page - 1}${querySuffix}`} aria-label={t("pagination.prev")}>
                  <ChevronLeft className="size-4" />
                </Link>
              </Button>
            )}
            <span className="text-sm tabular-nums text-muted-foreground">
              {page} / {totalPages}
            </span>
            {page >= totalPages ? (
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button variant="outline" size="icon" asChild>
                <Link href={`/admin/user-management?page=${page + 1}${querySuffix}`} aria-label={t("pagination.next")}>
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      <Sheet
        open={Boolean(activeUser)}
        onOpenChange={(open) => {
          if (!open) {
            closeSheet();
          }
        }}
      >
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
          {activeUser && (
            <>
              <SheetHeader className="space-y-1 border-b border-border/80 pb-4 text-left">
                <SheetTitle>{t("sheet.title")}</SheetTitle>
                <SheetDescription>{t("sheet.description", { name: activeUser.displayName })}</SheetDescription>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-6 py-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-user-email">{t("sheet.email")}</Label>
                    <Input
                      id="admin-user-email"
                      value={sheetEmail}
                      onChange={(e) => setSheetEmail(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-user-name">{t("sheet.displayName")}</Label>
                    <Input
                      id="admin-user-name"
                      value={sheetDisplayName}
                      onChange={(e) => setSheetDisplayName(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>{t("sheet.roles")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {roleCatalog.map((role) => {
                      const on = sheetRoles.includes(role.name);
                      return (
                        <Button
                          key={role.id}
                          type="button"
                          size="sm"
                          variant={on ? "default" : "outline"}
                          onClick={() => toggleRole(role.name)}
                        >
                          {role.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <SheetFooter className="border-t border-border/80 pt-4">
                <Button type="button" variant="outline" onClick={closeSheet}>
                  {t("sheet.cancel")}
                </Button>
                <Button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? <Loader /> : t("sheet.save")}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
