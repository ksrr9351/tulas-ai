"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import chatgptlogo from '@/assets/chatgptlogo.png';
import nouserlogo from '@/assets/nouserlogo.png';

interface Chat {
    _id: string;
    chatName: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

interface Message {
    _id: string;
    chatId: string;
    role: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface GroupedChat {
    chatId: string;
    chatName: string;
    lastMessage: string;
    updatedAt: string;
}

interface LeftSectionProps {
    onChatSelect: (chatId: string) => void;
}

const LeftSection = ({ onChatSelect }: LeftSectionProps) => {
    const [chats, setChats] = useState<GroupedChat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newChatName, setNewChatName] = useState<string>('');
    const [showNewChatInput, setShowNewChatInput] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [emailLoading, setEmailLoading] = useState<boolean>(true);
    const [emailError, setEmailError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                setEmailLoading(true);
                setEmailError(null);
    
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
                if (data.user?.email) {
                    setUserEmail(data.user.email);
                } else {
                    throw new Error("Email not found in response");
                }
            } catch (error: any) {
                console.error("Error fetching email:", error);
                setEmailError(error.message || "Failed to load email");
            } finally {
                setEmailLoading(false);
            }
        };
    
        fetchUserEmail();
    }, []);    


    // Fetch messages and group them by chatId
    const fetchMessagesAndGroupByChat = async () => {
        try {
            setLoading(true);
            setError(null); // Reset error state before fetching

            // In a real app, you would get the userId from authentication context
            const userId = 'default-user-id';

            console.log('Fetching messages for user:', userId);

            // First, fetch all chats for this user to get their names
            const chatsResponse = await fetch(`/api/chats?userId=${userId}`);

            if (!chatsResponse.ok) {
                const errorText = await chatsResponse.text();
                console.error(`API error (${chatsResponse.status}):`, errorText);
                throw new Error(`Server responded with ${chatsResponse.status}: ${errorText}`);
            }

            const chatsResult = await chatsResponse.json();

            if (!chatsResult.success || !Array.isArray(chatsResult.data)) {
                throw new Error('Invalid chat data received from API');
            }

            const chatMap = new Map();
            chatsResult.data.forEach((chat: Chat) => {
                chatMap.set(chat._id, {
                    chatId: chat._id,
                    chatName: chat.chatName,
                    lastMessage: '',
                    updatedAt: chat.updatedAt
                });
            });

            // Create a new API endpoint to fetch all messages grouped by chat
            const response = await fetch(`/api/messages-by-user?userId=${userId}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API error (${response.status}):`, errorText);
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Unknown API error');
            }

            // Process the messages and group them by chatId
            if (result.data && Array.isArray(result.data)) {
                console.log('Messages fetched successfully:', result.data);

                // Group messages by chatId and get the latest message for each chat
                const groupedChats = chatMap;

                result.data.forEach((message: Message) => {
                    const chatId = message.chatId;

                    if (groupedChats.has(chatId)) {
                        const chat = groupedChats.get(chatId);

                        // Compare dates to find the latest message
                        const messageDate = new Date(message.createdAt);
                        const currentLastMessageDate = new Date(chat.updatedAt);

                        if (messageDate > currentLastMessageDate) {
                            chat.lastMessage = message.content;
                            chat.updatedAt = message.createdAt;
                        }
                    }
                });

                // Convert Map to Array and sort by updatedAt (newest first)
                const chatArray = Array.from(groupedChats.values())
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

                setChats(chatArray);
            } else {
                console.warn('No messages found or invalid data format:', result.data);
                setChats([]);
            }
        } catch (err: any) {
            console.error('Error fetching messages:', err);
            // Set a user-friendly error message
            setError(err.message || 'Failed to load chats. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Create a new chat
    const createNewChat = async () => {
        if (!newChatName.trim()) return;

        try {
            setError(null); // Reset error state

            const response = await fetch('/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatName: newChatName,
                    userId: 'default-user-id', // In a real app, get from auth context
                }),
            });

            // Handle HTTP errors
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const result = await response.json();

            // Check if the API returned an error
            if (!result.success) {
                throw new Error(result.error || 'Unknown API error');
            }

            console.log('Chat created successfully:', result.data);

            // Refresh the chat list
            fetchMessagesAndGroupByChat();
            setNewChatName('');
            setShowNewChatInput(false);
        } catch (err: any) {
            console.error('Error creating chat:', err);
            setError(err.message || 'Failed to create chat. Please try again.');
        }
    };

    // Delete a chat
    const deleteChat = async (chatId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering onChatSelect

        try {
            setDeletingChatId(chatId);
            setIsDeleting(true);

            const response = await fetch(`/api/chats?chatId=${chatId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Unknown API error');
            }

            console.log('Chat deleted successfully:', chatId);

            // Remove the chat from the state
            setChats(prevChats => prevChats.filter(chat => chat.chatId !== chatId));

        } catch (err: any) {
            console.error('Error deleting chat:', err);
            setError(err.message || 'Failed to delete chat. Please try again.');
        } finally {
            setIsDeleting(false);
            setDeletingChatId(null);
        }
    };

    // Load chats when component mounts
    useEffect(() => {
        fetchMessagesAndGroupByChat();
    }, []);

    return (
        <div className="bg-[var(--col1)] h-full flex flex-col justify-between">
            <div className="flex justify-between items-center px-5 h-[10%]">
                <div className="flex items-center gap-2">
                    <Image src={chatgptlogo} alt="ChatGPT" width={80} height={80} className="rounded-full pt-10" />
                    <p className="text-white text-lg">Tula's AI</p>
                </div>
                <button
                    onClick={() => setShowNewChatInput(!showNewChatInput)}
                    className="text-white hover:bg-gray-700 p-2 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </button>
            </div>

            {showNewChatInput && (
                <div className="px-5 py-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newChatName}
                            onChange={(e) => setNewChatName(e.target.value)}
                            placeholder="Enter chat name"
                            className="flex-1 p-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && createNewChat()}
                        />
                        <button
                            onClick={createNewChat}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}

            <div className="h-[70%] overflow-auto flex flex-col gap-5 px-5">
                {loading ? (
                    <div className="text-white text-center py-4">
                        Loading chats...
                    </div>
                ) : error ? (
                    <div className="text-red-400 text-center py-4 flex flex-col items-center">
                        <div className="mb-2">⚠️ {error}</div>
                        <button
                            onClick={fetchMessagesAndGroupByChat}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                ) : chats.length === 0 ? (
                    <div className="text-white text-center py-4">
                        No chats found. Create your first chat!
                    </div>
                ) : (
                    chats.map((chat) => (
                        <div
                            key={chat.chatId}
                            className="text-white p-3 rounded-lg hover:bg-gray-700 cursor-pointer group relative"
                            onClick={() => onChatSelect(chat.chatId)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="pr-8"> {/* Add padding to make room for delete icon */}
                                    <div className="text-lg">{chat.chatName}</div>
                                    {chat.lastMessage && (
                                        <div className="text-sm text-gray-400 truncate mt-1">
                                            {chat.lastMessage.length > 50
                                                ? `${chat.lastMessage.substring(0, 50)}...`
                                                : chat.lastMessage
                                            }
                                        </div>
                                    )}
                                </div>
                                <button
                                    className={`
                                        absolute right-3 top-3 opacity-0 group-hover:opacity-100 
                                        transition-opacity duration-200 text-red-500 hover:text-red-300
                                        ${deletingChatId === chat.chatId ? 'opacity-100' : ''}
                                    `}
                                    onClick={(e) => deleteChat(chat.chatId, e)}
                                    disabled={isDeleting}
                                    title="Delete chat"
                                >
                                    {deletingChatId === chat.chatId && isDeleting ? (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex items-center px-5 h-[10%]">
                <div className="flex items-center gap-2">
                    <Image src={nouserlogo} alt="User" width={50} height={50} className="rounded-full" />
                    <p className="text-white text-lg">
                        {emailLoading ? "Loading..." : emailError ? "Error loading email" : userEmail}
                    </p>

                </div>
            </div>
        </div>
    );
};

export default LeftSection;
