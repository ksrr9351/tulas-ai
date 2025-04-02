"use client";
import React, { useState, useEffect, useRef } from "react";
import { HashLoader } from "react-spinners";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MessageRole = "user" | "assistant" | "system";
interface Message {
  role: MessageRole;
  content: string;
}

// Theme Toggle Component
function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-gray-600 hover:bg-gray-800">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ChatInterfaceProps {
  chatId?: string;
}

const ChatInterface = ({ chatId }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(true);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId || null);
  const [chatName, setChatName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [usernameLoading, setusernameLoading] = useState<boolean>(true);
  const [usernameError, setusernameError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        setusernameLoading(true);
        setusernameError(null);

        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch('/api/user', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Include token
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        if (data.user?.name) {
          setUsername(data.user.name);
        } else {
          throw new Error("Email not found in response");
        }
      } catch (error: any) {
        console.error("Error fetching email:", error);
        setusernameError(error.message || "Failed to load email");
      } finally {
        setusernameLoading(false);
      }
    };

    fetchUserName();
  }, []);

  // Handle hydration issues with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load chat messages if chatId is provided or changes
  useEffect(() => {
    if (chatId) {
      setCurrentChatId(chatId);
      setAllMessages([]); // Clear messages when switching chats
      fetchMessages(chatId);
    }
  }, [chatId]);

  // Function to fetch messages for a specific chat
  const fetchMessages = async (chatId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching messages for chat ID: ${chatId}`);
      const response = await fetch(`/api/chat-message?chatId=${chatId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        console.log('Received chat data:', data.data);

        if (data.data.chat) {
          setChatName(data.data.chat.chatName);
        }

        if (data.data.messages && Array.isArray(data.data.messages)) {
          // Convert the messages to the format expected by the component
          const formattedMessages: Message[] = data.data.messages.map((msg: any) => ({
            role: msg.role as MessageRole,
            content: msg.content as string
          }));

          console.log('Formatted messages:', formattedMessages);
          setAllMessages(formattedMessages);
        } else {
          console.warn('No messages found or messages is not an array:', data.data);
          setAllMessages([]);
        }
      } else {
        console.error('API returned error or invalid data format:', data);
        throw new Error(data.error || 'Failed to load chat data');
      }
    } catch (err: any) {
      console.error('Error fetching chat messages:', err);
      setError(err.message || 'Failed to load chat history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const models = [
    { id: "gpt-4o-mini", name: "Tulas 1.0", badge: "NEW" },
  ];

  const [selectedModel, setSelectedModel] = useState(models[0]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Function to create a new chat in MongoDB
  const createOrUpdateChat = async (firstMessage: string) => {
    try {
      // Generate a chat name from the first few words of the first message
      const generatedChatName = firstMessage.split(' ').slice(0, 5).join(' ') + '...';

      const response = await fetch('/api/chat-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatName: generatedChatName,
          userId: 'default-user-id', // In a real app, get from auth context
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create chat session:', errorText);
        return null;
      }

      const data = await response.json();

      if (!data.success) {
        console.error('API returned error:', data.error);
        return null;
      }

      console.log('Chat created successfully:', data.data);
      setChatName(data.data.chatName);
      return data.data._id;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  // Save a message to the database
  const saveMessage = async (chatId: string, role: MessageRole, content: string) => {
    try {
      const response = await fetch('/api/save-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          role,
          content
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to save ${role} message:`, errorText);
        return false;
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error(`Error saving ${role} message:`, error);
      return false;
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = { role: "user", content: message };
    const updatedMessages = [...allMessages, userMessage];
    setAllMessages(updatedMessages);
    setMessage("");
    setIsSent(false);

    let chatIdToUse = currentChatId;

    // If this is the first message and no chatId exists, create a new chat
    if (!currentChatId) {
      const newChatId = await createOrUpdateChat(message);
      if (newChatId) {
        chatIdToUse = newChatId;
        setCurrentChatId(newChatId);
        console.log('Created new chat with ID:', newChatId);
      } else {
        console.error('Failed to create new chat');
        setIsSent(true);
        return;
      }
    }

    // Save user message to database
    if (chatIdToUse) {
      const saved = await saveMessage(chatIdToUse, "user", userMessage.content);
      if (!saved) {
        console.warn('Failed to save user message to database');
      }
    }

    try {
      // Send message to API for AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel.id,
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to get response: ${response.status}`);
      }

      const data = await response.json();

      if (!data.message) {
        throw new Error('Received empty response from API');
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message
      };

      // Add the assistant's response to the messages
      setAllMessages([...updatedMessages, assistantMessage]);

      // Save assistant message to database
      if (chatIdToUse) {
        const saved = await saveMessage(chatIdToUse, "assistant", assistantMessage.content);
        if (!saved) {
          console.warn('Failed to save assistant message to database');
        }
      }
    } catch (error: any) {
      console.error("Error sending message:", error);

      // Add error message to the chat
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the AI service. Please try again later."
      };

      setAllMessages([...updatedMessages, errorMessage]);

      // Save error message to database
      if (chatIdToUse) {
        await saveMessage(chatIdToUse, "assistant", errorMessage.content);
      }
    } finally {
      setIsSent(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    window.location.reload(); // Refresh the page to log out
  };


  return (
    <div className="flex flex-col h-screen bg-white text-black dark:bg-[#0D0D0D] dark:text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-3 bg-gray-100 dark:bg-[#0D0D0D]">
        <div className="flex items-center space-x-3">
          <Select
            defaultValue={selectedModel.id}
            onValueChange={(value) => {
              const model = models.find(m => m.id === value);
              if (model) setSelectedModel(model);
            }}

          >
            <SelectTrigger className="bg-transparent border-0 focus:ring-0 focus:ring-offset-0 p-2 h-auto shadow-none">
              <div className="flex items-center font-semibold text-xl">
                <SelectValue placeholder="Tulas A.I" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto">
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{model.name}</span>
                    {model.badge && (
                      <span className="ml-2 text-xs bg-green-600 px-2 py-0.5 rounded text-white">
                        {model.badge}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {chatName && (
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {chatName}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {/* Moved Theme Toggle to the right */}
          <ModeToggle />
          <div className="relative group">
            <img
              src="/nouserlogo.png"
              alt="User"
              className="w-12 h-12 rounded-full cursor-pointer"
            />
            <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-900 shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main chat area */}
      <div className="flex-1 overflow-auto p-5 flex flex-col items-center bg-gray-50 dark:bg-[#0D0D0D]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <HashLoader color={theme === 'dark' ? "#36d7b7" : "#1e88e5"} size={40} />
          </div>
        ) : error ? (
          <div className="text-red-500 bg-red-100 dark:bg-red-900/20 p-4 rounded-lg max-w-3xl mx-auto">
            <p>{error}</p>
            <button
              onClick={() => chatId && fetchMessages(chatId)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        ) : allMessages.length > 0 ? (
          <div className="w-full max-w-3xl">
            {allMessages.map((msg, index) => (
              <div key={index} className={`mb-6 ${msg.role === "assistant" ? "bg-white dark:bg-[#1E1E1E] -mx-5 p-5 shadow-sm" : ""}`}>
                <div className="flex items-start max-w-3xl mx-auto">
                  <div className={`w-20 h-10 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-purple-600" : "bg-green-600"}`}>
                    {msg.role === "user" ? username || "U" : "T"}
                  </div>
                  <div className="ml-5 space-y-1">
                    <p className="text-sm font-medium">{msg.role === "user" ? "You" : "Tulas A.I"}</p>
                    <div className="prose dark:prose-invert max-w-none">{msg.content}</div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full max-w-2xl text-center">
            <h1 className="text-4xl font-semibold mb-5">What can I help with?</h1>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 mx-auto w-full max-w-3xl">
        <div className="relative bg-white dark:bg-[#1A1A1A] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <textarea
            ref={inputRef}
            className="w-full bg-transparent p-3 pr-14 pl-3 outline-none resize-none max-h-90 text-black dark:text-white"
            placeholder="Ask anything"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />

          <div className="absolute bottom-3 right-3">
            {isSent ? (
              <button
                onClick={sendMessage}
                className={`${message.trim() ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
                disabled={!message.trim()}
              >
                <svg width="55" height="55" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12L3 8.57C3 8.57 2.59 8.41 2.5 8.57C2.42 8.73 2.5 9 2.5 9L4.36 11.59C4.36 11.59 4.5 11.73 4.36 11.88C4.22 12.04 4.05 12 4.05 12L2.77 11.87C2.77 11.87 2.5 11.93 2.5 12.09C2.5 12.25 2.77 12.35 2.77 12.35L4.3 13.11C4.3 13.11 4.58 13.16 4.3 13.32C4.01 13.47 3.78 13.38 3.78 13.38L2.7 12.95C2.7 12.95 2.42 12.94 2.5 13.1C2.58 13.26 2.65 13.22 2.65 13.22L4.11 14.21C4.11 14.21 4.2 14.31 4.11 14.39C4.01 14.47 3.67 14.32 3.67 14.32L2.89 13.91C2.89 13.91 2.63 13.97 2.7 14.13C2.77 14.29 2.95 14.35 2.95 14.35L12 19L22 12L12 5L2.5 8.57" fill="currentColor" />
                </svg>
              </button>
            ) : (
              <div>
                <HashLoader color={theme === 'dark' ? "#36d7b7" : "#1e88e5"} size={16} />
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          Tulas A.I can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;