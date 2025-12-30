import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
    imageSrc?: string; // Đường dẫn đến ảnh logo
    rounded?: boolean; // Bo tròn logo
}

const Logo: React.FC<LogoProps> = ({ 
    className = '', 
    showText = true, 
    size = 'md',
    imageSrc,
    rounded = true // Mặc định bo tròn
}) => {
    const sizeMap = {
        sm: { width: 40, height: 40, textSize: 'text-lg' },
        md: { width: 60, height: 60, textSize: 'text-2xl' },
        lg: { width: 80, height: 80, textSize: 'text-3xl' }
    };

    const dimensions = sizeMap[size];

    // Nếu có imageSrc, sử dụng ảnh
    if (imageSrc) {
        return (
            <div className={`flex items-center ${className}`}>
                <img 
                    src={imageSrc} 
                    alt="TrailsExplorer Logo" 
                    className={`flex-shrink-0 object-contain ${rounded ? 'rounded-full' : ''}`}
                    style={{ 
                        width: dimensions.width, 
                        height: dimensions.height 
                    }}
                />
                {showText && (
                    <div className="ml-3">
                        <span className={`font-display font-bold text-forest-green ${dimensions.textSize}`}>
                            Trails
                        </span>
                        <span className={`font-display font-bold text-earth-brown ${dimensions.textSize}`}>
                            Explorer
                        </span>
                    </div>
                )}
            </div>
        );
    }

    // Fallback: SVG logo (nếu không có ảnh)
    return (
        <div className={`flex items-center ${className}`}>
            <svg
                width={dimensions.width}
                height={dimensions.height}
                viewBox="0 0 200 120"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                {/* Mountains */}
                <g>
                    {/* Left mountain */}
                    <path
                        d="M 30 80 L 30 50 L 50 30 L 50 80 Z"
                        fill="none"
                        stroke="#2d5016"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Central mountain (tallest with M shape) */}
                    <path
                        d="M 50 80 L 50 20 L 70 10 L 90 20 L 90 80 Z"
                        fill="none"
                        stroke="#2d5016"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Right mountain */}
                    <path
                        d="M 90 80 L 90 50 L 110 30 L 110 80 Z"
                        fill="none"
                        stroke="#2d5016"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Base line connecting mountains */}
                    <line
                        x1="30"
                        y1="80"
                        x2="110"
                        y2="80"
                        stroke="#2d5016"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    {/* Winding trail path */}
                    <path
                        d="M 20 85 Q 40 75, 60 85 T 100 85"
                        fill="none"
                        stroke="#2d5016"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Compass star (golden, upper right) */}
                    <g transform="translate(130, 15)">
                        <path
                            d="M 0 -15 L 4 -4 L 15 -4 L 6 2 L 9 13 L 0 7 L -9 13 L -6 2 L -15 -4 L -4 -4 Z"
                            fill="url(#starGradient)"
                            stroke="#d4a574"
                            strokeWidth="1.5"
                        />
                        <defs>
                            <linearGradient id="starGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#f4d03f" stopOpacity="1" />
                                <stop offset="100%" stopColor="#d4a574" stopOpacity="1" />
                            </linearGradient>
                        </defs>
                    </g>
                </g>
            </svg>
            {showText && (
                <div className="ml-3">
                    <span className={`font-display font-bold text-forest-green ${dimensions.textSize}`}>
                        Trails
                    </span>
                    <span className={`font-display font-bold text-earth-brown ${dimensions.textSize}`}>
                        Explorer
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;
