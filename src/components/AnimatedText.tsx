import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

type TextToken = { type: 'word' | 'space'; value: string; startIndex: number };

function tokenizeText(text: string): TextToken[] {
  const tokens: TextToken[] = [];
  let index = 0;

  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    tokens.push({
      type: /^\s+$/.test(part) ? 'space' : 'word',
      value: part,
      startIndex: index,
    });
    index += part.length;
  }

  return tokens;
}

export default function AnimatedText({
  text,
  className = '',
  style,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const tokens = useMemo(() => tokenizeText(text), [text]);
  const totalChars = text.length;

  return (
    <p
      ref={containerRef}
      className={`relative text-pretty [hyphens:none] ${className}`.trim()}
      style={style}
    >
      {tokens.map((token, tokenIndex) => (
        <span
          key={`${token.startIndex}-${tokenIndex}`}
          className={token.type === 'word' ? 'inline-block whitespace-nowrap' : 'inline'}
        >
          {token.value.split('').map((char, charIndex) => (
            <AnimatedLetter
              key={token.startIndex + charIndex}
              char={char}
              scrollYProgress={scrollYProgress}
              index={token.startIndex + charIndex}
              total={totalChars}
            />
          ))}
        </span>
      ))}
    </p>
  );
}

interface AnimatedLetterProps {
  char: string;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  index: number;
  total: number;
}

function AnimatedLetter({
  char,
  scrollYProgress,
  index,
  total,
}: AnimatedLetterProps) {
  const charProgress = index / total;
  const start = Math.max(0, charProgress - 0.1);
  const end = Math.min(1, charProgress + 0.05);
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1], { clamp: true });

  return (
    <span className="relative inline">
      <span className="invisible font-medium">
        {char === ' ' ? '\u00A0' : char}
      </span>
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 font-medium text-[#D7E2EA]"
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
}
