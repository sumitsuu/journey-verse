import Container from "@/src/components/UI/Container";
import httpRequests from "../../../http-requests/types-requests";
import ArtsView from "../_components/arts-view";

export default async function ArtsPage() {
  const types = await httpRequests.getTypes();
  return (
    <Container className="!px-4">
      <ArtsView types={types} />
    </Container>
  );
}
