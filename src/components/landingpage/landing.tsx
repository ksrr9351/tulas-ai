import React from 'react';
import Section from './Section';
import Service from './service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#F3F6F8] relative overflow-hidden">
      {/* Background gradient overlay - blurred gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#005BD1] via-[#FFCB90] to-[#FF0004] opacity-10 blur-3xl"></div>
      </div>

      {/* Large CHATBOT watermark - more visible */}
      <div className="absolute pt-5 sm:top-0 w-full overflow-hidden flex items-center justify-center">
        <div className="text-[15rem] sm:text-[20rem] font-bold text-[#F3F6F8] leading-none tracking-tighter opacity-50">
          TULAS A.I
        </div>
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Navigation header */}
        <div className="flex justify-between items-center mb-16">
          <div className="text-[#0084FF] font-bold text-2xl">Tulas A.I</div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-800 hover:text-[#0084FF]">About</a>
            <a href="#" className="text-gray-800 hover:text-[#0084FF]">Technology</a>
            <a href="#" className="text-gray-800 hover:text-[#0084FF]">How it's Work</a>
            <a href="#" className="text-gray-800 hover:text-[#0084FF]">Features</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <button className="bg-[#0084FF] text-white font-medium px-6 py-2 rounded-full cursor-pointer">Sign in</button>
            </Link>
            <Link href="/signup">
              <button className="bg-white text-gray-800 border border-gray-200 font-medium px-6 py-2 rounded-full cursor-pointer">Get Started</button>
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row items-start gap-10">
          {/* Left side - Slogan */}
          <div className="w-full md:w-1/2">
            <h1 className="text-7xl lg:text-8xl font-bold text-[#9CA8BB] leading-tight">
              More <br />
              Than Just <br />
              <span className="text-[#FF5900]">Answers</span>
            </h1>

            <div className="mt-10">
              <Link href="/signup">
                <button className="bg-[#0084FF] text-white px-6 py-3 rounded-md flex items-center cursor-pointer">
                  Use Tulas A.I
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>

          {/* Right side - Features */}
          <div className="w-full md:w-1/2 relative">
            {/* Gray box placeholder */}
            <div className="relative mb-16">
              <img
                src="/background.png"
                alt="Background"
                className="w-full h-100 mix-blend-multiply md:h-100 rounded-lg transform rotate-6 object-cover gradient-shadow "
              />
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-lg text-[#0084FF] font-medium">Let's Chat, Your Way</h2>
                <p className="text-[#222222]/70 mt-2">
                  This chatbot adapts to your style of conversation, offering an experience that feels like talking to a true friend.
                </p>
              </div>

              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-[#9CA8BB]">People Joined</div>
                  <div className="text-2xl font-bold text-gray-500">125K+</div>
                </div>
                <div>
                  <div className="text-sm text-[#9CA8BB]">Fraud Probability</div>
                  <div className="text-2xl font-bold text-gray-500">0,25%</div>
                </div>
              </div>

              <div className="bg-[#F3F6F8] p-4 rounded-lg relative">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-m text-gray-500">How its work</div>
                  </div>
                  <div className="bg-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0084FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/20 rounded-tl-3xl -mb-12 -mr-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*section */}
      <div>
        <Section />
      </div>

      {/*service */}
      <div>
        <Service />
      </div>
    </div>
  );
};

export default Landing;