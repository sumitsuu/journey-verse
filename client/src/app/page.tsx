import artsRequests from "../http-requests/arts-requests";
import { HomeContextWrapper } from "./_components/home/home-context-wrapper";
import HomeView from "./_components/home/home-view";

async function HomePage() {
  // TODO: добавить динамический typeId
  const arts = await artsRequests.getArts(1, {});

  return (
    <HomeContextWrapper arts={arts}>
      <div className={"flex justify-center w-full py-9"}>
        <div className={"max-w-[1280px]"}>
          <HomeView />
        </div>
      </div>
    </HomeContextWrapper>
  );
}

export default HomePage;
