"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatInterface from "@/components/RightSection";
import LeftSection from "@/components/LeftSection";
import Landing from "@/components/landingpage/landing";

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams ? searchParams.get("chatId") : null;
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    chatId || undefined
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (chatId) {
      setSelectedChatId(chatId);
    }
  }, [chatId]);

  const handleChatSelect = (id: string) => {
    setSelectedChatId(id);
    router.push(`/?chatId=${id}`);
  };

  if (isAuthenticated === null) {
    return null; // Prevent flicker while checking authentication
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 h-full text-gray-500 bg-black">
        <LeftSection onChatSelect={handleChatSelect} />
      </div>
      <div className="w-3/4 h-full border-l border-gray-700">
        <ChatInterface chatId={selectedChatId} />
      </div>
    </div>
  );
};

export default Home;
