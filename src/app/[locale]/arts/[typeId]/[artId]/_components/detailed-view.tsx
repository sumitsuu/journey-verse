"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { PICTURE_PLACEHOLDER } from "@/lib/constants";
import { ConfirmationDialog } from "@/src/app/_components/confirmation-dialog";
import Container from "@/src/components/UI/Container";
import parseDates from "@/src/helpers/parse-dates";
import { useRouter } from "@/src/i18n/routing";
import { removeArtFromLibraryAction } from "@/src/lib/actions/library/remove-art-from-library.action";
import type { FindArtsOutput } from "@/src/lib/services/art/find-arts.service";
import { getFileUrl } from "@/src/lib/utils/file-url";
import { useMutation } from "@tanstack/react-query";
import "moment/locale/ru";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import AddToLibraryDialog from "./add-to-library-dialog/add-to-library-dialog";
import { useDetailedViewContext } from "./detailed-view-context-wrapper";

type Genre = FindArtsOutput["genres"][number];

const DetailedView = () => {
  const [isAddToLibraryDialogOpen, setIsAddToLibraryDialogOpen] = useState(false);
  const [isDeleteFromLibraryDialogOpen, setIsDeleteFromLibraryDialogOpen] = useState(false);
  const handleAddToLibraryDialog = () => setIsAddToLibraryDialogOpen((prev) => !prev);
  const handleDeleteFromLibraryDialog = () => setIsDeleteFromLibraryDialogOpen((prev) => !prev);
  const artDetailsTranslations = useTranslations("ArtDetails");
  const { art, library } = useDetailedViewContext();
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { mutate: removeArtFromLibrary } = useMutation({
    mutationFn: removeArtFromLibraryAction,
    onSuccess: () => {
      toast({
        title: artDetailsTranslations("removedFromLibrarySuccess"),
        variant: "success",
      });
      handleDeleteFromLibraryDialog();
      router.refresh();
    },
    onError: () => {
      toast({
        title: artDetailsTranslations("removeFromLibraryError"),
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <div className="relative h-full grow">
        <Container className={"isolate z-[10000]"}>
          <>
            <div className={"flex lg:pt-10 flex-col md:flex-row pt-5"}>
              <div className={"flex flex-col items-center md:block md:mr-5 mr-0"}>
                <Image
                  src={art.previewPath ? getFileUrl(art.previewPath) : PICTURE_PLACEHOLDER}
                  alt=""
                  className={"w-full max-w-[250px] h-[400px]"}
                  width={250}
                  height={400}
                  quality={90}
                />
                <Button
                  onClick={library ? handleDeleteFromLibraryDialog : handleAddToLibraryDialog}
                  className={"w-full mt-3"}
                >
                  {library ? artDetailsTranslations("removeFromLibrary") : artDetailsTranslations("addToLibrary")}
                </Button>
              </div>

              <div className={"w-full max-w-[1200px] md:p-4 md:pt-0 pb-5"}>
                <h1 className={"mb-1 md:mt-0 mt-5 text-2xl font-bold"}>{art.title}</h1>
                <p>
                  <span>{art.description}</span>
                </p>

                <div className={"flex mt-6 gap-8"}>
                  <div>
                    <p>
                      <span>{artDetailsTranslations("releaseYear")} </span>
                    </p>
                    {!!art.genres?.length && (
                      <p>
                        <span>{artDetailsTranslations("genres")}</span>
                      </p>
                    )}
                    {art.episodes && art.episodes >= 1 && (
                      <p>
                        <span>{artDetailsTranslations("episodes")}</span>
                      </p>
                    )}
                    <p>
                      <span>{artDetailsTranslations("rating")}</span>
                    </p>
                    {art.status.name && (
                      <p>
                        <span>{artDetailsTranslations("status")}</span>
                      </p>
                    )}
                    {art.country.name && (
                      <p>
                        <span>{artDetailsTranslations("country")}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <p>{parseDates(art.releaseDate, locale)}</p>
                    {!!art.genres?.length && <p>{art.genres.map((item: Genre) => item.name).join(", ")}</p>}
                    {art.episodes && art.episodes >= 1 && <p>{art.episodes}</p>}
                    <p>{art.rating !== null ? `${art.rating} ` : artDetailsTranslations("notRated")}</p>
                    {art.status.name && <p>{art.status.name}</p>}
                    {art.country.name && <p>{art.country.name}</p>}
                  </div>
                </div>
                {/*<ArtsItemFrames id={item.id} />*/}
              </div>
            </div>

            <AddToLibraryDialog onOpenChange={handleAddToLibraryDialog} isDialogOpen={isAddToLibraryDialogOpen} />
            <ConfirmationDialog
              title={artDetailsTranslations("deleteFromLibrary")}
              description={artDetailsTranslations("deleteFromLibraryDescription")}
              onConfirm={() => {
                if (userId && library) {
                  removeArtFromLibrary({ userId, libraryId: library.id });
                }
              }}
              onCancel={handleDeleteFromLibraryDialog}
              isOpen={isDeleteFromLibraryDialogOpen}
              onOpenChange={handleDeleteFromLibraryDialog}
            />
          </>
        </Container>
      </div>
    </>
  );
};
export default DetailedView;
