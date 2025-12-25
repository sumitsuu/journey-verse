import { Link } from "@/src/i18n/routing";
import { getFileUrl } from "@/src/lib/utils/file-url";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

const UserInfo = ({ setIsSidebarOpen }: { setIsSidebarOpen: Dispatch<SetStateAction<boolean>> }) => {
  const { data: session } = useSession();
  const sessionUser = session?.user;

  return (
    <div className={"max-w-max"}>
      <div className={"lg:flex hidden items-center gap-2"}>
        <Link className={"text-xl text-white block"} href={`/users/${sessionUser?.id}`}>
          {sessionUser?.image ? (
            <Image
              className={"object-cover rounded-[20px]"}
              src={getFileUrl(sessionUser.image)}
              alt=""
              width={50}
              height={50}
              unoptimized
            />
          ) : (
            <div
              className={
                "select-none size-[50px] rounded-[20px] text-light-purple-1 bg-black-2 flex items-center justify-center uppercase"
              }
            >
              {sessionUser?.displayName?.split("")[0]}
              {sessionUser?.displayName?.split("")[1]}
            </div>
          )}

          {sessionUser?.displayName}
        </Link>
      </div>

      <User
        className={"lg:hidden block text-white size-[36px]"}
        onClick={() => setIsSidebarOpen((prev: boolean) => !prev)}
      />
    </div>
  );
};

export default UserInfo;
