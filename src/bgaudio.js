import React, { useEffect, useRef } from 'react';

const BackgroundAudio = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    
    // Try to autoplay
    const playAudio = () => {
      audio.play().catch(error => {
        console.log("Audio autoplay blocked by browser. Will play on first user interaction.");
        
        // If autoplay fails, play on ANY user interaction
        const startOnInteraction = () => {
          audio.play()
            .then(() => {
              console.log("Audio started after user interaction");
              // Remove all listeners after audio starts
              document.removeEventListener('click', startOnInteraction);
              document.removeEventListener('keypress', startOnInteraction);
              document.removeEventListener('touchstart', startOnInteraction);
            })
            .catch(err => console.log("Audio play failed:", err));
        };

        // Listen for clicks, key presses, or touch
        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('keypress', startOnInteraction, { once: true });
        document.addEventListener('touchstart', startOnInteraction, { once: true });
      });
    };

    playAudio();

    // Cleanup on unmount
    return () => {
      audio.pause();
    };
  }, []);

  return (
    <audio 
      ref={audioRef}
      loop
      volume="0.3"
      preload="auto"
      style={{ display: 'none' }}
    >
      <source src="/audio/bgmusic.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default BackgroundAudio;