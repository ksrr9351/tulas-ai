// Service.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

interface ServiceCardProps {
    title: string;
    isActive: boolean;
    position: 'main' | 'secondary' | 'tertiary';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, isActive, position }) => {
    let positionClasses = '';
    let opacityClass = '';
    let zIndexClass = '';

    switch (position) {
        case 'main':
            positionClasses = 'left-0 top-0';
            opacityClass = 'opacity-100';
            zIndexClass = 'z-30';
            break;
        case 'secondary':
            positionClasses = 'left-32 top-12';
            opacityClass = 'opacity-80';
            zIndexClass = 'z-20';
            break;
        case 'tertiary':
            positionClasses = 'left-64 top-24';
            opacityClass = 'opacity-60';
            zIndexClass = 'z-10';
            break;
    }

    return (
        <div className={`absolute ${positionClasses} ${opacityClass} ${zIndexClass} transition-all duration-500 ease-in-out`}>
            <div className="w-full">
                <div className="h-48 w-80 bg-gray-300 rounded-lg shadow-md"></div>

                {position === 'main' && (
                    <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 px-4">
                        <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50/95 shadow-sm">
                            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                            <div className="bg-white p-1 rounded-md">
                                <ArrowUpRight size={16} className="text-gray-800" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Service: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const services = [
        "Natural Language Understanding",
        "Multi-Language Support",
        "Advanced Analytics"
    ];

    // Auto slide functionality
    useEffect(() => {
        if (isAutoPlaying) {
            autoPlayIntervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % services.length);
            }, 3000); // Change slide every 3 seconds
        }

        return () => {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }
        };
    }, [isAutoPlaying, services.length]);

    // Pause auto slide on user interaction
    const pauseAutoPlay = () => {
        setIsAutoPlaying(false);
        // Resume after 10 seconds of inactivity
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToSlide = (index: number) => {
        pauseAutoPlay();
        setCurrentSlide(index);
    };

    const goToNextSlide = () => {
        pauseAutoPlay();
        setCurrentSlide((prev) => (prev + 1) % services.length);
    };

    const goToPrevSlide = () => {
        pauseAutoPlay();
        setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
    };

    const getCardPosition = (index: number): 'main' | 'secondary' | 'tertiary' => {
        if (index === currentSlide) return 'main';
        if (index === (currentSlide + 1) % services.length) return 'secondary';
        return 'tertiary';
    };

    return (
        <div className="flex flex-col lg:flex-row items-start justify-between p-6 md:p-12 bg-gradient-to-r from-pink-100 to-white min-h-[600px] w-full max-w-screen-4xl mx-auto">
            {/* Left side content */}
            <div className="w-full lg:w-1/3 mb-12 lg:mb-0">
                <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">Service</h1>
                <p className="text-gray-500 mb-12 max-w-lg text-lg">
                    Adaptable chatbot service designed to provide seamless and personalized communication experiences.
                </p>
                <button className="flex items-center bg-orange-500 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-orange-600 transition-colors">
                    BUY NOW!!!
                    <ChevronRight size={24} className="ml-2" />
                </button>
            </div>

            {/* Right side slider */}
            <div className="w-full lg:w-2/3 relative">
                <div className="flex items-center space-x-6 mb-12">
                    

                    <div className="flex space-x-2">
                        {services.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-gray-800' : 'bg-gray-300'
                                    } hover:bg-gray-400 transition-colors`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                    </div>
                </div>

                <div className="relative h-96 w-full">
                    <div className="absolute top-2 right-12 text-sm text-gray-800 font-medium">
                        {String(currentSlide + 1).padStart(2, '0')}/{String(services.length).padStart(2, '0')}
                    </div>

                    {/* Service cards */}
                    <div className="relative w-full h-full">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={index}
                                title={service}
                                isActive={index === currentSlide}
                                position={getCardPosition(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Service;