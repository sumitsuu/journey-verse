import Container from "@/src/components/UI/Container";
import { findTypes } from "@/src/lib/services";
import ArtsView from "../_components/arts-view";

export default async function ArtsPage() {
  const types = await findTypes();
  return (
    <Container className="!px-4">
      <ArtsView types={types} />
    </Container>
  );
}
