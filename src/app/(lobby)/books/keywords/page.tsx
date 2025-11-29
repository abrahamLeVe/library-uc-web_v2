import { KeywordBadgesAdvanced } from "@/components/keywords/keywords-badges";
import { fetchPalabrasClaveFullData } from "@/lib/data/Keywords.data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Libros por palabras clave",
};

export const revalidate = 60;

export default async function Page() {
  const palabrasClaveData = await fetchPalabrasClaveFullData();

  return <KeywordBadgesAdvanced data={palabrasClaveData} />;
}
