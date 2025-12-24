"use client";

import { Button } from "@/components/ui/button";
import Container from "@/src/components/UI/Container";
import parseDates from "@/src/helpers/parse-dates";
import type { Art } from "@/src/lib/types/art";
import type { Genre } from "@/src/lib/types/genre";

import "moment/locale/ru";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";

const TOOLTIP_TEXT = "Rating is calculated based on user ratings.";
const RATING_NOT_RATED = "Not rated by users";
const BG_COLOR = "#191919";

type DetailedViewProps = object;
const DetailedView = ({}: DetailedViewProps) => {
  const { artId: id, typeId: type }: { artId: string; typeId: string } = useParams();
  const [item, setItem] = useState<Art | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isInLib, setIsInLib] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(true);
  const handleModal = () => setIsModalOpened((prev) => !prev);

  const { data: session } = useSession();
  const user = session?.user;
  const handleDeleteFromLibrary = async () => {
    if (user?.id && item?.id) {
    }
  };

  return (
    <>
      {item?.id && (
        <div className={`relative h-full grow bg-[${BG_COLOR}]`}>
          {/*<img*/}
          {/*  src={""}*/}
          {/*  alt=""*/}
          {/*  className={`absolute left-0 top-0 opacity-25 h-full w-full object-cover`}*/}
          {/*/>*/}
          <Container className={"isolate z-[10000]"}>
            <>
              <div className={"flex lg:pt-10 flex-col md:flex-row pt-5"}>
                <div className={"flex flex-col items-center md:block md:mr-5 mr-0"}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_ARTS_FILES_URL}/${item?.previewPath}`}
                    alt=""
                    srcSet=""
                    className={"w-full max-w-[250px] h-[400px]"}
                  />
                  <Button onClick={isInLib ? handleDeleteFromLibrary : handleModal} className={"w-full mt-3"}>
                    {isInLib ? "Remove from my library" : "Add to my library"}
                  </Button>
                </div>

                <div className={"w-full max-w-[1200px] md:p-4 md:pt-0 pb-5"}>
                  <h1 className={"mb-1 md:mt-0 mt-5"}>{item.title}</h1>

                  {item?.description && (
                    <p>
                      <span>{item.description}</span>
                    </p>
                  )}

                  <div className={"flex mt-6 gap-8"}>
                    <div>
                      <p>
                        <span>Release Year: </span>
                      </p>
                      {!!item?.genres?.length && (
                        <p>
                          <span>Genres:</span>
                        </p>
                      )}
                      {item.episodes && item.episodes >= 1 && (
                        <p>
                          <span>Episodes:</span>
                        </p>
                      )}
                      <p>
                        <span>Rating:</span>
                      </p>
                      {item?.status.name && (
                        <p>
                          <span>Status:</span>
                        </p>
                      )}
                      {item?.country.name && (
                        <p>
                          <span>Country:</span>
                        </p>
                      )}
                      <p>
                        <span>Actors:</span>
                      </p>
                      <p>
                        <span>Directors:</span>
                      </p>
                    </div>

                    <div>
                      <p>
                        {parseDates(item.releaseDate, "ru")}
                        {/*todo Optimize for localization (later)*/}
                      </p>
                      {!!item?.genres?.length && <p>{item.genres.map((item: Genre) => item.name).join(", ")}</p>}
                      {item.episodes && item.episodes >= 1 && <p>{item.episodes}</p>}
                      <p>{item.rating !== null ? `${item.rating} ` : RATING_NOT_RATED}</p>
                      {item?.status.name && <p>{item.status.name}</p>}
                      {item?.country.name && <p>{item.country.name}</p>}
                      <p>Lorem ipsum dolor</p>

                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
                    </div>
                  </div>
                  {/*<ArtsItemFrames id={item.id} />*/}
                </div>
              </div>

              {/* {libraryStatuses.length > 0 &&
                                libraryRatings.length > 0 &&
                                Boolean(item.episodes) && (
                                    <AddToLibraryModal
                                        setIsInLib={setIsInLib}
                                        item={item}
                                        type={0}
                                        artId={Number(id)}
                                        maxEpisodes={Number(item.episodes)}
                                        handleModal={handleModal}
                                        isDialogOpen={isModalOpened}
                                    />
                                )} */}
            </>
          </Container>
        </div>
      )}
    </>
  );
};
export default DetailedView;
