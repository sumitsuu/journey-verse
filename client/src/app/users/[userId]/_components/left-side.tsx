import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const StatContainer = ({ title, subtitle, className }: { title: string; subtitle: string; className?: string }) => {
  return (
    <div
      className={`bg-black-2 rounded-lg flex flex-col justify-center items-center w-full h-24 text-center ${className}`}
    >
      <div className="text-white text-lg font-bold">{title}</div>
      <div className="text-sm text-gray-400">{subtitle}</div>
    </div>
  );
};

export default function LeftSide() {
  const { data: session } = useSession();
  const { userId } = useParams();
  const isSameUser = Number(session?.user?.id) === Number(userId);

  return (
    <div className={"h-[90vh] flex items-center justify-center lg:pb-8"}>
      <div
        className={
          "lg:min-w-[400px] md:min-w-[70%] min-h-[95%] flex flex-col items-center justify-center gap-8 border border-white/10 shadow-2xl rounded-[15px] md:py-8 py-4 lg:py-8"
        }
      >
        <div className={"size-40 bg-white rounded-full flex items-center text-black justify-center text-2xl"}>
          {session?.user.displayName.split(" ")[0].charAt(0)}
          {session?.user.displayName.split(" ")[1].charAt(0)}
        </div>
        <div className={"flex flex-col items-center gap-2"}>
          <p className={"text-4xl"}>{session?.user.displayName}</p>
          <p className={"text-lg"}>{session?.user.email}</p>
        </div>
        {isSameUser && (
          <div className={"w-full max-w-[75%]"}>
            <Button className={"w-full"}>Изменить профиль</Button>
          </div>
        )}

        <div className={"grid grid-cols-2 gap-4 w-full max-w-[75%]"}>
          <StatContainer title={"3.9"} subtitle={"Средняя оценка"} />
          <StatContainer title={"123"} subtitle={"Количество оценок"} />
          <StatContainer title={"31"} subtitle={"Подписок"} />
          <StatContainer title={"95"} subtitle={"Подписчиков"} />
          <StatContainer title={"12"} subtitle={"Списков"} className={"col-span-2"} />
        </div>
      </div>
    </div>
  );
}
