import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ProtectedVideoPlayer({ videoUrl, moduleTitle }) {
    const { user } = useAuth();
    const [isBlurred, setIsBlurred] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        // Detect window focus loss (potential screen sharing/recording)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsBlurred(true);
                setWarningMessage('Video paused - Window not in focus');
            } else {
                setIsBlurred(false);
                setWarningMessage('');
            }
        };

        const handleBlur = () => {
            setIsBlurred(true);
            setWarningMessage('Video hidden - Please keep this window in focus');
        };

        const handleFocus = () => {
            setIsBlurred(false);
            setWarningMessage('');
        };

        // Detect Picture-in-Picture (often used for recording)
        const handlePiP = () => {
            setIsBlurred(true);
            setWarningMessage('Picture-in-Picture detected - Video hidden for security');
        };

        // Disable right-click on video container
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable keyboard shortcuts for screenshots
        const handleKeyDown = (e) => {
            // Detect PrintScreen, or Ctrl+Shift+S, Cmd+Shift+4, etc.
            if (
                e.key === 'PrintScreen' ||
                (e.ctrlKey && e.shiftKey && e.key === 'S') ||
                (e.metaKey && e.shiftKey && e.key === '4') ||
                (e.metaKey && e.shiftKey && e.key === '3')
            ) {
                e.preventDefault();
                setIsBlurred(true);
                setWarningMessage('Screenshots are not allowed');
                setTimeout(() => {
                    setIsBlurred(false);
                    setWarningMessage('');
                }, 3000);
            }
        };

        // Try to detect screen capture API usage
        const detectScreenCapture = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                // Override getDisplayMedia to detect when it's called
                const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
                navigator.mediaDevices.getDisplayMedia = async function(...args) {
                    setIsBlurred(true);
                    setWarningMessage('Screen recording detected - Video hidden');
                    return originalGetDisplayMedia(...args);
                };
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('enterpictureinpicture', handlePiP);
        
        detectScreenCapture();

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('enterpictureinpicture', handlePiP);
        };
    }, []);

    // Generate watermark text
    const watermarkText = user ? `${user.name} | ${user.email}` : 'Day Learning';

    return (
        <div 
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden select-none"
            style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Video iframe */}
            <iframe
                src={videoUrl}
                title={moduleTitle}
                className={`w-full h-full transition-all duration-300 ${isBlurred ? 'blur-xl opacity-20' : ''}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ 
                    pointerEvents: isBlurred ? 'none' : 'auto',
                }}
            />

            {/* Watermark overlay */}
            <div 
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{ opacity: 0.15 }}
            >
                <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-20 -rotate-12">
                    {[...Array(20)].map((_, i) => (
                        <span 
                            key={i} 
                            className="text-white text-sm font-mono whitespace-nowrap"
                            style={{ textShadow: '0 0 2px rgba(0,0,0,0.5)' }}
                        >
                            {watermarkText}
                        </span>
                    ))}
                </div>
            </div>

            {/* Warning overlay when blurred */}
            {isBlurred && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                    <ShieldAlert className="w-16 h-16 text-amber mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Content Protected</h3>
                    <p className="text-muted-foreground text-center max-w-md px-4">
                        {warningMessage || 'This video is protected. Please return focus to this window to continue watching.'}
                    </p>
                </div>
            )}

            {/* Anti-recording notice */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-xs text-muted-foreground">
                <ShieldAlert className="w-3 h-3" />
                Protected Content
            </div>

            {/* Invisible overlay to prevent direct video interaction for recording */}
            <div 
                className="absolute inset-0 z-5"
                style={{ 
                    background: 'transparent',
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
}
