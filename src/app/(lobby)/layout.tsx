import ChatSliderOver from "@/components/chat/ChatSliderOver";
import Footer from "@/components/footer/footer-index";
import HeaderMain from "@/components/nav-bar/header-main";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
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
      </main>
      <Footer />
    </>
  );
}
