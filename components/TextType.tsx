'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';

const TextType = ({
  text,
  typingSpeed = 50,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  cursorCharacter = '|',
  cursorBlinkDuration = 0.5,
}: {
  text: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  cursorCharacter?: string;
  cursorBlinkDuration?: number;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const textArray = useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [text]
  );

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const currentText = textArray[currentTextIndex];

    if (isDeleting) {
      if (displayedText === '') {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
        setCurrentCharIndex(0);
      } else {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (currentCharIndex < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + currentText[currentCharIndex]);
          setCurrentCharIndex((prev) => prev + 1);
        }, typingSpeed);
      } else {
        if (!loop && currentTextIndex === textArray.length - 1) return;
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
  ]);

  return (
    <span className={className}>
      <span>{displayedText}</span>
      {showCursor && (
        <span
          ref={cursorRef}
          style={{ marginLeft: '2px', color: '#ffb000' }}
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  );
};

export default TextType;
