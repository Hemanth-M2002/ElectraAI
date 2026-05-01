import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useSpring(0, { damping: 20, stiffness: 200 });
  const cursorY = useSpring(0, { damping: 20, stiffness: 200 });
  
  const followerX = useSpring(0, { damping: 30, stiffness: 150 });
  const followerY = useSpring(0, { damping: 30, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 4);
      cursorY.set(e.clientY - 4);
      followerX.set(e.clientX - 16);
      followerY.set(e.clientY - 16);
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName === 'A' || 
        e.target.tagName === 'BUTTON' || 
        e.target.closest('button') ||
        e.target.classList.contains('interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, followerX, followerY]);

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovering ? 2.5 : 1,
        }}
      />
      <motion.div
        className="cursor-follower"
        style={{
          x: followerX,
          y: followerY,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.3 : 0.6,
        }}
      />
    </>
  );
};

export default CustomCursor;
