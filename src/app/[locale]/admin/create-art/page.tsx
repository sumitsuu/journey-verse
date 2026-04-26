import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import type { Locale } from "@/src/lib/i18n/locales";
import { findCountries } from "@/src/lib/services/country/find-countries.service";
import { findGenres } from "@/src/lib/services/genre/find-genres.service";
import { findStatuses } from "@/src/lib/services/status/find-statuses.service";
import { findTypes } from "@/src/lib/services/type/find-types.service";
import { hasRole } from "@/src/lib/services/user/find-user-roles.service";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { CreateArtView } from "./_components/create-art-view";

const CreateArtPage = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const session = await getServerSession(authOptions);

  if (!session || !(await hasRole(session.user.id, "admin"))) {
    notFound();
  }

  const { locale } = await params;
  const [countries, types, statuses, genres] = await Promise.all([
    findCountries(locale),
    findTypes({ locale }),
    findStatuses({ locale, type: "art" }),
    findGenres(locale),
  ]);

  return <CreateArtView countries={countries} types={types} statuses={statuses} genres={genres} locale={locale} />;
};

export default CreateArtPage;
