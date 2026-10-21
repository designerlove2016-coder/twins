import React, { useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface SpringTiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  maxTilt?: number;
  scaleOnHover?: number;
  mass?: number;
  tension?: number;
  friction?: number;
}

export const SpringTiltCard: React.FC<SpringTiltCardProps> = ({
  children,
  className = '',
  onClick,
  maxTilt = 14,
  scaleOnHover = 1.04,
  mass = 1.2,
  tension = 380,
  friction = 26,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // React-Spring physics-based spring with inertia, mass, tension, and damping
  const [props, api] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass, tension, friction },
  }));

  const calcTilt = (clientX: number, clientY: number) => {
    if (!cardRef.current) return [0, 0, 1];
    const rect = cardRef.current.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * maxTilt;
    const rotY = (x / (rect.width / 2)) * maxTilt;

    return [rotX, rotY, scaleOnHover];
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    api.start({ xys: calcTilt(e.clientX, e.clientY) });
  };

  const handleMouseLeave = () => {
    api.start({ xys: [0, 0, 1] });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      api.start({ xys: calcTilt(e.touches[0].clientX, e.touches[0].clientY) });
    }
  };

  const handleTouchEnd = () => {
    api.start({ xys: [0, 0, 1] });
  };

  return (
    <animated.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
      style={{
        transform: props.xys.to(
          (x, y, s) => `perspective(900px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
        ),
      }}
      className={`relative transform-gpu will-change-transform select-none ${className}`}
    >
      {children}
    </animated.div>
  );
};
