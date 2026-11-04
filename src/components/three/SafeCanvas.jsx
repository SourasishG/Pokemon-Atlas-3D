import React, { forwardRef, Component } from "react";
import { Canvas, events } from "@react-three/fiber";

export function createSafeEvents(store) {
  const pe = events(store);
  const originalConnect = pe.connect;
  const originalDisconnect = pe.disconnect;

  pe.connect = (target) => {
    if (!target || typeof target.addEventListener !== "function") {
      return;
    }
    try {
      originalConnect(target);
    } catch (err) {
      console.warn("Safe connect prevented error:", err);
    }
  };

  pe.disconnect = () => {
    try {
      originalDisconnect();
    } catch (err) {
      console.warn("Safe disconnect prevented error:", err);
    }
  };

  return pe;
}

export class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("WebGL / 3D Canvas error safely caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center p-6 text-center bg-slate-950/70 rounded-2xl border border-white/10 font-mono">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
            <span className="text-base font-bold">3D</span>
          </div>
          <span className="text-xs uppercase font-bold text-cyan-400 mb-1">
            WebGL Acceleration Offline
          </span>
          <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
            Hardware acceleration is inactive or unsupported on this device.
            Displaying 2D holographic data.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const SafeCanvas = forwardRef(
  ({ events: customEvents, fallback, children, ...props }, ref) => {
    return (
      <CanvasErrorBoundary fallback={fallback}>
        <Canvas ref={ref} events={customEvents || createSafeEvents} {...props}>
          {children}
        </Canvas>
      </CanvasErrorBoundary>
    );
  },
);

SafeCanvas.displayName = "SafeCanvas";
export default SafeCanvas;
