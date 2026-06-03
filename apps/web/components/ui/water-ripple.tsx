'use client';

import React, { useRef, useEffect } from 'react';

interface WaterRippleProps {
  imageUrl: string;
  isActive: boolean;
}

/**
 * Physics-based water ripple simulation using dual-buffer height maps.
 * Renders source image in grayscale. Gentle ripples on mouse move,
 * soft splash on click/tap — like touching a calm pond.
 */
export const WaterRipple: React.FC<WaterRippleProps> = ({ imageUrl, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Simulation parameters ──
    const SIM_SCALE = 0.5;
    const DAMPING = 0.993;       // Slower decay — waves settle in 5-7 seconds
    const REFRACTION = 128;      // Gentler bending of the image

    let screenW = window.innerWidth;
    let screenH = window.innerHeight;
    canvas.width = screenW;
    canvas.height = screenH;

    let simW = Math.floor(screenW * SIM_SCALE);
    let simH = Math.floor(screenH * SIM_SCALE);

    // Dual height-map buffers (wave equation ping-pong)
    let bufferA = new Float32Array(simW * simH);
    let bufferB = new Float32Array(simW * simH);

    // Off-screen canvas for source image pixels
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');

    let srcPixels: ImageData | null = null;
    let imgLoaded = false;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      imgLoaded = true;
      offCanvas.width = simW;
      offCanvas.height = simH;
      if (offCtx) {
        // Apply grayscale filter when drawing the source image
        offCtx.filter = 'grayscale(100%)';
        offCtx.drawImage(img, 0, 0, simW, simH);
        offCtx.filter = 'none';
        try {
          srcPixels = offCtx.getImageData(0, 0, simW, simH);
        } catch (e) {
          console.warn('[WaterRipple] Could not read image pixels (CORS). Ripple effect disabled.', e);
          imgLoaded = false;
        }
      }
    };

    // ── Drop a "stone" into the water ──
    const dropAt = (px: number, py: number, radius: number, strength: number) => {
      const cx = Math.floor(px * SIM_SCALE);
      const cy = Math.floor(py * SIM_SCALE);
      const r = Math.floor(radius * SIM_SCALE);

      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          const dist = Math.sqrt(x * x + y * y);
          if (dist > r) break;

          const sx = cx + x;
          const sy = cy + y;
          if (sx < 0 || sx >= simW || sy < 0 || sy >= simH) continue;

          const factor = 0.5 * (1 + Math.cos(Math.PI * dist / r));
          const bIdx = sy * simW + sx;
          bufferA[bIdx] = (bufferA[bIdx] ?? 0) + strength * factor;
        }
      }
    };

    // ── Event handlers ──

    // Gentle ripples as mouse moves across the surface
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() < 0.06) {
        dropAt(e.clientX, e.clientY, 8, 25);
      }
    };

    // Soft click splash — like dipping a finger into a pond
    const handleClick = (e: MouseEvent) => {
      dropAt(e.clientX, e.clientY, 14, 80);
    };

    // Touch support
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0] && Math.random() < 0.06) {
        dropAt(e.touches[0].clientX, e.touches[0].clientY, 8, 25);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        dropAt(e.touches[0].clientX, e.touches[0].clientY, 14, 80);
      }
    };

    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });

    const handleResize = () => {
      screenW = window.innerWidth;
      screenH = window.innerHeight;
      canvas.width = screenW;
      canvas.height = screenH;

      const newSimW = Math.floor(screenW * SIM_SCALE);
      const newSimH = Math.floor(screenH * SIM_SCALE);

      bufferA = new Float32Array(newSimW * newSimH);
      bufferB = new Float32Array(newSimW * newSimH);
      simW = newSimW;
      simH = newSimH;

      if (imgLoaded && offCtx) {
        offCanvas.width = simW;
        offCanvas.height = simH;
        offCtx.filter = 'grayscale(100%)';
        offCtx.drawImage(img, 0, 0, simW, simH);
        offCtx.filter = 'none';
        try {
          srcPixels = offCtx.getImageData(0, 0, simW, simH);
        } catch { /* CORS fallback */ }
      }
    };

    window.addEventListener('resize', handleResize);

    // Output image data for rendering
    let outData: ImageData | null = null;
    let animationFrameId: number;

    const simulate = (_time: number) => {
      if (!isActive) return;
      if (!imgLoaded || !srcPixels) {
        animationFrameId = requestAnimationFrame(simulate);
        return;
      }

      // ── Wave propagation (discrete wave equation) ──
      for (let y = 1; y < simH - 1; y++) {
        for (let x = 1; x < simW - 1; x++) {
          const idx = y * simW + x;
          const avg =
            (bufferA[idx - 1]! +
              bufferA[idx + 1]! +
              bufferA[idx - simW]! +
              bufferA[idx + simW]!) * 0.5;

          bufferB[idx] = (avg - bufferB[idx]!) * DAMPING;
        }
      }

      // Swap buffers
      const temp = bufferA;
      bufferA = bufferB;
      bufferB = temp;

      // ── Render refracted image ──
      if (!outData || outData.width !== simW || outData.height !== simH) {
        outData = ctx.createImageData(simW, simH);
      }

      const src = srcPixels.data;
      const dst = outData.data;

      for (let y = 1; y < simH - 1; y++) {
        for (let x = 1; x < simW - 1; x++) {
          const idx = y * simW + x;

          // Height gradient → refraction offset
          const dxH = bufferA[idx - 1]! - bufferA[idx + 1]!;
          const dyH = bufferA[idx - simW]! - bufferA[idx + simW]!;

          // Offset source pixel coordinates
          let srcX = Math.floor(x + dxH * REFRACTION / 256);
          let srcY = Math.floor(y + dyH * REFRACTION / 256);

          // Clamp to bounds
          srcX = Math.max(0, Math.min(simW - 1, srcX));
          srcY = Math.max(0, Math.min(simH - 1, srcY));

          const srcIdx = (srcY * simW + srcX) * 4;
          const dstIdx = idx * 4;

          // Copy refracted pixel
          dst[dstIdx] = src[srcIdx]!;
          dst[dstIdx + 1] = src[srcIdx + 1]!;
          dst[dstIdx + 2] = src[srcIdx + 2]!;
          dst[dstIdx + 3] = 255;

          // Subtle caustic highlights
          const caustic = (dxH * dxH + dyH * dyH) * 0.15;
          if (caustic > 0) {
            dst[dstIdx] = Math.min(255, dst[dstIdx]! + caustic);
            dst[dstIdx + 1] = Math.min(255, dst[dstIdx + 1]! + caustic);
            dst[dstIdx + 2] = Math.min(255, dst[dstIdx + 2]! + caustic * 0.8);
          }
        }
      }

      // Draw the refracted result scaled up to full canvas
      offCanvas.width = simW;
      offCanvas.height = simH;
      if (offCtx) {
        offCtx.putImageData(outData, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(offCanvas, 0, 0, screenW, screenH);
      }

      animationFrameId = requestAnimationFrame(simulate);
    };

    animationFrameId = requestAnimationFrame(simulate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', handleResize);
    };
  }, [imageUrl, isActive]);

  return <canvas ref={canvasRef} className="w-screen h-screen absolute inset-0 block z-[5]" />;
};
