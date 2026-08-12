import React, { forwardRef } from 'react';
import { Canvas, events } from '@react-three/fiber';

export function createSafeEvents(store) {
  const pe = events(store);
  const originalConnect = pe.connect;
  const originalDisconnect = pe.disconnect;

  pe.connect = (target) => {
    if (!target || typeof target.addEventListener !== 'function') {
      return;
    }
    try {
      originalConnect(target);
    } catch (err) {
      console.warn('Safe connect prevented error:', err);
    }
  };

  pe.disconnect = () => {
    try {
      originalDisconnect();
    } catch (err) {
      console.warn('Safe disconnect prevented error:', err);
    }
  };

  return pe;
}

export const SafeCanvas = forwardRef(({ events: customEvents, children, ...props }, ref) => {
  return (
    <Canvas
      ref={ref}
      events={customEvents || createSafeEvents}
      {...props}
    >
      {children}
    </Canvas>
  );
});

SafeCanvas.displayName = 'SafeCanvas';
export default SafeCanvas;
