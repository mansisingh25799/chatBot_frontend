"use client";
import "./global.css";
import { Inter } from "next/font/google";
import { useState, createContext, useContext } from "react";
import SideBar from "../components/SideBar";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"]
});

interface ChatContextType {
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within RootLayout");
  }
  return context;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatKey, setChatKey] = useState(0);
  const pathname = usePathname();

  const hideSidebar = pathname.startsWith("/auth");
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const resetChat = () => setChatKey((prev) => prev + 1);

  return (
    <html lang="en" className={inter.className}>
      <body>
        {hideSidebar ? (
          <main className="authFullPage">{children}</main>
        ) : (
          <ChatContext.Provider value={{ resetChat }}>
            <div className="appContainer">
              <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <main className={`chatArea ${isSidebarOpen ? "withSidebar" : "collapsed"}`}>
                {pathname === "/chat" ? (
                  <div key={chatKey}>{children}</div>
                ) : (
                  children
                )}
              </main>
            </div>
          </ChatContext.Provider>
        )}
      </body>
    </html>
  );
}
