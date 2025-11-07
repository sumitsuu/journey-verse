import { Dispatch, SetStateAction } from "react";

import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const UserInfo = ({ setIsSidebarOpen }: { setIsSidebarOpen: Dispatch<SetStateAction<boolean>> }) => {
  const { data: session } = useSession();
  const sessionUser = session?.user;

  const userAvatarPath = sessionUser?.path || "placeholder.png";

  return (
    <div className={"max-w-max"}>
      <div className={"lg:flex hidden items-center gap-2"}>
        <Link className={"text-xl text-white block"} href={`/users/${sessionUser?.id}`}>
          <img className={"size-[50px]"} src={`${process.env.NEXT_PUBLIC_USERS_FILES_URL}/${userAvatarPath}`} alt="" />

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
