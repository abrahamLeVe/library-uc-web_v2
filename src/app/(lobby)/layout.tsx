import ChatSliderOver from "@/components/chat/ChatSliderOver";
import Footer from "@/components/footer/footer-index";
import { KeywordBadgesAdvanced } from "@/components/keywords/keywords-badges";
import HeaderMain from "@/components/nav-bar/header-main";
import { fetchPalabrasClaveFullData } from "@/lib/data/Keywords.data";
import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const palabrasClaveData = await fetchPalabrasClaveFullData();
  return (
    <>
      <Suspense fallback={<div className="h-16 bg-gray-900" />}>
        <HeaderMain />
      </Suspense>
      <main className="container mx-auto p-2">
        {children}

        <div className="fixed right-5 bottom-5">
          <Suspense
            fallback={
              <div className="w-[130px] h-[80px] rounded-full bg-gray-200"></div>
            }
          >
            <ChatSliderOver />
          </Suspense>
        </div>
        <KeywordBadgesAdvanced data={palabrasClaveData} />
      </main>
      <Footer />
    </>
  );
}
