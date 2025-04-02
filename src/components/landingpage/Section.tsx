import React from 'react';

const Section: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-100 via-white to-blue-100">
            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10 p-8">
                {/* Left column */}
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                    {/* Main content box */}
                    <div className="bg-white rounded-3xl shadow-sm p-10">
                        <div>
                            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                                Making
                                <br />
                                Every Chat
                                <br />
                                Count
                            </h1>
                            <div className="mt-4">
                                <p className="text-gray-400 text-lg">
                                    Every conversation
                                    <br />
                                    matters, and this chatbot
                                    <br />
                                    makes it worthwhile with
                                    <br />
                                    responses that are
                                    <br />
                                    thoughtful and personal.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Gray box below main content */}
                    <div className="h-100 rounded-3xl">
                        <img
                            src="/secbg.png"
                            alt="Background"
                            className="w-full h-100 mix-blend-multiply md:h-100 rounded-lg transform object-cover gradient-shadow "
                        />
                    </div>
                </div>

                {/* Right column */}
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                    {/* Top gray box */}
                    <div className="h-64 bg-gray-300 rounded-3xl"></div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Percentage section */}
                        <div className="flex-1 flex items-center">
                            <div>
                                <span className="text-8xl font-bold text-gray-900 leading-none">99</span>
                                <span className="text-8xl font-bold text-orange-500 leading-none">%</span>
                                <div className="mt-2 text-gray-400">
                                    Project
                                    <br />
                                    finished
                                </div>
                            </div>
                        </div>

                        {/* Gray box next to percentage */}
                        <div className="flex-1 bg-gray-300 rounded-3xl h-32"></div>
                    </div>

                    {/* Call to action */}
                    <div className="bg-white rounded-3xl shadow-sm p-8 flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                            Let's Chat,
                            <br />
                            Your Way
                        </div>
                        <div className="rounded-full p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-900"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section;