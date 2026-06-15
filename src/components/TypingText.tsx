import React, { useState, useEffect } from 'react';

interface TypingTextProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export const TypingText: React.FC<TypingTextProps> = ({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
}) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: number;
    const fullPhrase = phrases[currentPhraseIndex];

    if (isDeleting) {
      timer = window.setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
    } else {
      timer = window.setTimeout(() => {
        setCurrentText((prev) => fullPhrase.slice(0, prev.length + 1));
      }, typingSpeed);
    }

    // Handle state transitions
    if (!isDeleting && currentText === fullPhrase) {
      // Pause at full text
      timer = window.setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      // Move to next phrase index
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="inline-flex items-center">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 font-mono font-bold tracking-tight">
        {currentText}
      </span>
      <span className="ml-[2px] inline-block w-[3px] h-[1.3em] bg-cyan-400 animate-pulse" />
    </span>
  );
};

export default TypingText;
