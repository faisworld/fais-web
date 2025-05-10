import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  delay = 0,
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentRef = countRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      
      let startTime: number | null = null;
      const startValue = 0;
      
      // Add delay if specified
      setTimeout(() => {
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          
          // Use easeOutQuart for smoother animation near the end
          const easeProgress = 1 - Math.pow(1 - progress, 4);
          const currentCount = Math.floor(easeProgress * (end - startValue) + startValue);
          
          setCount(currentCount);
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setCount(end);
          }
        };
        
        window.requestAnimationFrame(step);
      }, delay);
    }
  }, [isVisible, end, duration, delay]);
  return (
    <span ref={countRef} className="inline-block">
      {prefix}
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;

