import React, { forwardRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export const SafeOrbitControls = forwardRef(({
  makeDefault = false,
  camera,
  domElement,
  enableDamping = true,
  dampingFactor = 0.05,
  rotateSpeed = 0.8,
  zoomSpeed = 0.8,
  enableZoom = true,
  minDistance = 2.5,
  maxDistance = 8,
  enablePan = false,
  maxPolarAngle = Math.PI / 2 + 0.1,
  autoRotate = false,
  autoRotateSpeed = 1.5,
  onChange,
  onStart,
  onEnd,
  ...props
}, ref) => {
  const defaultCamera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const events = useThree((state) => state.events);
  const invalidate = useThree((state) => state.invalidate);
  const set = useThree((state) => state.set);
  const get = useThree((state) => state.get);

  const activeCamera = camera || defaultCamera;
  const activeDomElement = domElement || events?.connected || gl?.domElement;

  const controls = useMemo(() => {
    if (!activeCamera) return null;
    try {
      return new OrbitControlsImpl(activeCamera);
    } catch (e) {
      console.warn('Failed to initialize OrbitControlsImpl:', e);
      return null;
    }
  }, [activeCamera]);

  // Imperatively forward the controls instance to parent ref
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(controls);
    } else {
      ref.current = controls;
    }
    return () => {
      if (typeof ref === 'function') {
        ref(null);
      } else {
        ref.current = null;
      }
    };
  }, [ref, controls]);

  useEffect(() => {
    if (!controls || !activeDomElement) return;

    // Safely patch connect to prevent null addEventListener calls
    const originalConnect = controls.connect ? controls.connect.bind(controls) : null;
    if (originalConnect) {
      controls.connect = (targetElement) => {
        const el = targetElement || activeDomElement;
        if (!el || typeof el.addEventListener !== 'function') return;
        try {
          originalConnect(el);
        } catch (err) {
          console.warn('OrbitControls connect error:', err);
        }
      };
    }

    if (activeDomElement && typeof activeDomElement.addEventListener === 'function') {
      try {
        controls.connect(activeDomElement);
      } catch (err) {
        console.warn('Error during controls.connect:', err);
      }
    }

    const handleChange = (e) => {
      invalidate();
      if (onChange) onChange(e);
    };
    const handleStart = (e) => {
      if (onStart) onStart(e);
    };
    const handleEnd = (e) => {
      if (onEnd) onEnd(e);
    };

    if (typeof controls.addEventListener === 'function') {
      controls.addEventListener('change', handleChange);
      if (onStart) controls.addEventListener('start', handleStart);
      if (onEnd) controls.addEventListener('end', handleEnd);
    }

    return () => {
      if (typeof controls.removeEventListener === 'function') {
        controls.removeEventListener('change', handleChange);
        if (onStart) controls.removeEventListener('start', handleStart);
        if (onEnd) controls.removeEventListener('end', handleEnd);
      }
      if (typeof controls.dispose === 'function') {
        try {
          controls.dispose();
        } catch (err) {
          // Ignore disposal errors on unmount
        }
      }
    };
  }, [controls, activeDomElement, invalidate, onChange, onStart, onEnd]);

  useEffect(() => {
    if (makeDefault && controls) {
      const oldControls = get().controls;
      set({ controls });
      return () => set({ controls: oldControls });
    }
  }, [makeDefault, controls, get, set]);

  useFrame(() => {
    if (controls && controls.enabled) {
      controls.update();
    }
  });

  if (!controls || !activeDomElement) return null;

  return (
    <primitive
      object={controls}
      enableDamping={enableDamping}
      dampingFactor={dampingFactor}
      rotateSpeed={rotateSpeed}
      zoomSpeed={zoomSpeed}
      enableZoom={enableZoom}
      minDistance={minDistance}
      maxDistance={maxDistance}
      enablePan={enablePan}
      maxPolarAngle={maxPolarAngle}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      {...props}
    />
  );
});

SafeOrbitControls.displayName = 'SafeOrbitControls';
export default SafeOrbitControls;
