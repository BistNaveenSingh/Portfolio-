'use client';

import React, { useRef, useEffect } from 'react';

interface WaterRippleProps {
  imageUrl: string;
  isActive: boolean;
}

export const WaterRipple: React.FC<WaterRippleProps> = ({ imageUrl, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SIM_SCALE = 0.5;
    const DAMPING = 0.985;
    const REFRACTION = 0.28;
    const SPEC_POWER = 26;
    const SPEC_INTENSITY = 110;
    const CAUSTIC = 0.65;
    const MAX_HEIGHT = 400;
    const TRAIL_SPACING = 3;

    let screenW = window.innerWidth;
    let screenH = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = screenW * dpr;
    canvas.height = screenH * dpr;
    canvas.style.width = screenW + 'px';
    canvas.style.height = screenH + 'px';
    ctx.scale(dpr, dpr);

    let simW = Math.max(2, Math.floor(screenW * SIM_SCALE));
    let simH = Math.max(2, Math.floor(screenH * SIM_SCALE));

    let bufferA = new Float32Array(simW * simH);
    let bufferB = new Float32Array(simW * simH);

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');

    let srcPixels: Uint8ClampedArray | null = null;
    let imgLoaded = false;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';

    const loadPixels = () => {
      if (!offCtx) return;
      offCanvas.width = simW;
      offCanvas.height = simH;
      offCtx.filter = 'grayscale(100%)';
      offCtx.drawImage(img, 0, 0, simW, simH);
      offCtx.filter = 'none';
      try {
        srcPixels = offCtx.getImageData(0, 0, simW, simH).data;
        imgLoaded = true;
      } catch (e) {
        console.warn('[WaterRipple] CORS issue, ripple disabled.', e);
        srcPixels = null;
        imgLoaded = false;
      }
    };

    img.onload = loadPixels;
    img.src = imageUrl;

    let lastDropX = -1;
    let lastDropY = -1;

    const isInTextRegion = (px: number, py: number) => {
      const cx = screenW / 2;
      const cy = screenH * 0.38;
      return Math.abs(px - cx) < 300 && Math.abs(py - cy) < 100;
    };

    const handleResize = () => {
      screenW = window.innerWidth;
      screenH = window.innerHeight;
      canvas.width = screenW * dpr;
      canvas.height = screenH * dpr;
      canvas.style.width = screenW + 'px';
      canvas.style.height = screenH + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      simW = Math.max(2, Math.floor(screenW * SIM_SCALE));
      simH = Math.max(2, Math.floor(screenH * SIM_SCALE));
      bufferA = new Float32Array(simW * simH);
      bufferB = new Float32Array(simW * simH);
      lastDropX = -1;
      lastDropY = -1;
      if (imgLoaded) loadPixels();
    };
    window.addEventListener('resize', handleResize);

    const dropAt = (px: number, py: number, radius: number, strength: number) => {
      const cx = Math.floor(px * SIM_SCALE);
      const cy = Math.floor(py * SIM_SCALE);
      const r = Math.max(1, Math.ceil(radius * SIM_SCALE));
      const rSq = r * r;
      const sigma = r * 0.5;
      const denom = Math.max(0.001, 2 * sigma * sigma);

      for (let dy = -r; dy <= r; dy++) {
        const y = cy + dy;
        if (y < 1 || y >= simH - 1) continue;
        const yOff = y * simW;
        const dySq = dy * dy;

        for (let dx = -r; dx <= r; dx++) {
          const distSq = dx * dx + dySq;
          if (distSq > rSq) continue;

          const x = cx + dx;
          if (x < 1 || x >= simW - 1) continue;

          const factor = Math.exp(-distSq / denom);
          bufferA[yOff + x] = bufferA[yOff + x]! + strength * factor;
        }
      }
    };

    const emitTrail = (x: number, y: number) => {
      if (lastDropX < 0) {
        lastDropX = x;
        lastDropY = y;
        dropAt(x, y, 10, 60);
        return;
      }
      const dx = x - lastDropX;
      const dy = y - lastDropY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < TRAIL_SPACING) {
        dropAt(x, y, 10, 50);
        return;
      }
      const steps = Math.min(24, Math.floor(dist / TRAIL_SPACING));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        dropAt(lastDropX + dx * t, lastDropY + dy * t, 10, 55);
      }
      lastDropX = x;
      lastDropY = y;
    };

    const handleClick = (e: MouseEvent) => {
      if (isInTextRegion(e.clientX, e.clientY)) return;
      dropAt(e.clientX, e.clientY, 16, 350);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches || !e.touches[0]) return;
      const t = e.touches[0];
      if (isInTextRegion(t.clientX, t.clientY)) return;
      emitTrail(t.clientX, t.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches || !e.touches[0]) return;
      const t = e.touches[0];
      if (isInTextRegion(t.clientX, t.clientY)) return;
      lastDropX = t.clientX;
      lastDropY = t.clientY;

      dropAt(t.clientX, t.clientY, 16, 350);
    };

    const handleTouchEnd = () => {
      lastDropX = -1;
      lastDropY = -1;
    };

    canvas.style.pointerEvents = 'auto';
    const leafCursor = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg transform='rotate(-45 16 16)'%3E%3Cpath d='M16 2 Q6 8 5 16 Q4 24 10 30 L16 32 L22 30 Q28 24 27 16 Q26 8 16 2Z' fill='%234CAF50' stroke='%232E7D32' stroke-width='1'/%3E%3Cpath d='M16 5 L16 24' stroke='%232E7D32' stroke-width='1' fill='none'/%3E%3Cpath d='M16 14 Q11 11 9 16' stroke='%232E7D32' stroke-width='1' fill='none'/%3E%3Cpath d='M16 14 Q21 11 23 16' stroke='%232E7D32' stroke-width='1' fill='none'/%3E%3C/g%3E%3C/svg%3E\") 6 6, auto";
    canvas.style.cursor = leafCursor;
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    let outData: ImageData | null = null;
    let animationFrameId: number;

    const lx = 0.32;
    const ly = -0.48;
    const lz = 0.82;
    const lLen = Math.sqrt(lx * lx + ly * ly + lz * lz);
    const lxN = lx / lLen;
    const lyN = ly / lLen;
    const lzN = lz / lLen;

    const simulate = (time: number) => {
      if (!imgLoaded || !srcPixels) {
        animationFrameId = requestAnimationFrame(simulate);
        return;
      }

      // Run simulation six times per frame for much faster wave propagation
      for (let step = 0; step < 6; step++) {
        for (let y = 1; y < simH - 1; y++) {
          const yOff = y * simW;
          const yU = yOff - simW;
          const yD = yOff + simW;
          for (let x = 1; x < simW - 1; x++) {
            const idx = yOff + x;
            const avg =
              (bufferA[idx - 1]! +
                bufferA[idx + 1]! +
                bufferA[yU + x]! +
                bufferA[yD + x]!) *
              0.5;

            let edgeDamp = 1.0;
            const BORDER = 15;
            if (x < BORDER) edgeDamp *= (x / BORDER);
            else if (x > simW - 1 - BORDER) edgeDamp *= ((simW - 1 - x) / BORDER);
            if (y < BORDER) edgeDamp *= (y / BORDER);
            else if (y > simH - 1 - BORDER) edgeDamp *= ((simH - 1 - y) / BORDER);

            let nh = (avg - bufferB[idx]!) * (DAMPING * edgeDamp);

            if (nh > MAX_HEIGHT) nh = MAX_HEIGHT;
            else if (nh < -MAX_HEIGHT) nh = -MAX_HEIGHT;
            bufferB[idx] = nh;
          }
        }

        const temp = bufferA;
        bufferA = bufferB;
        bufferB = temp;
      }

      if (!outData || outData.width !== simW || outData.height !== simH) {
        outData = ctx.createImageData(simW, simH);
      }
      const src = srcPixels;
      const dst = outData.data;

      for (let y = 1; y < simH - 1; y++) {
        const yOff = y * simW;
        const yOffPx = yOff * 4;
        for (let x = 1; x < simW - 1; x++) {
          const idx = yOff + x;

          const dxH = bufferA[idx - 1]! - bufferA[idx + 1]!;
          const dyH = bufferA[idx - simW]! - bufferA[idx + simW]!;

          let srcXf = x + dxH * REFRACTION;
          let srcYf = y + dyH * REFRACTION;
          if (srcXf < 0) srcXf = 0;
          else if (srcXf > simW - 1) srcXf = simW - 1;
          if (srcYf < 0) srcYf = 0;
          else if (srcYf > simH - 1) srcYf = simH - 1;

          const sx0 = srcXf | 0;
          const sy0 = srcYf | 0;
          const sx1 = sx0 + 1 < simW ? sx0 + 1 : simW - 1;
          const sy1 = sy0 + 1 < simH ? sy0 + 1 : simH - 1;
          const fx = srcXf - sx0;
          const fy = srcYf - sy0;
          const a = (1 - fx) * (1 - fy);
          const b = fx * (1 - fy);
          const c = (1 - fx) * fy;
          const d = fx * fy;

          const i00 = (sy0 * simW + sx0) * 4;
          const i10 = (sy0 * simW + sx1) * 4;
          const i01 = (sy1 * simW + sx0) * 4;
          const i11 = (sy1 * simW + sx1) * 4;

          const r0 = src[i00]! * a + src[i10]! * b + src[i01]! * c + src[i11]! * d;
          const g0 = src[i00 + 1]! * a + src[i10 + 1]! * b + src[i01 + 1]! * c + src[i11 + 1]! * d;
          const b0 = src[i00 + 2]! * a + src[i10 + 2]! * b + src[i01 + 2]! * c + src[i11 + 2]! * d;

          const nx = -dxH * 0.04;
          const ny = -dyH * 0.04;
          const invN = 1 / Math.sqrt(nx * nx + ny * ny + 1);
          const dot = (nx * lxN + ny * lyN + lzN) * invN;
          const spec = dot > 0 ? Math.pow(dot, SPEC_POWER) * SPEC_INTENSITY : 0;

          const h = bufferA[idx]!;
          const crest = h > 0 ? h * CAUSTIC : 0;
          const depth = h < 0 ? -h * 0.18 : 0;

          const dr = r0 - depth;
          const dg = g0 - depth;
          const db = b0 - depth * 0.4;

          const dstIdx = yOffPx + x * 4;
          dst[dstIdx] = dr < 0 ? 0 : dr > 255 ? 255 : dr + spec * 0.6 + crest;
          dst[dstIdx + 1] = dg < 0 ? 0 : dg > 255 ? 255 : dg + spec * 0.8 + crest;
          dst[dstIdx + 2] = db < 0 ? 0 : db > 255 ? 255 : db + spec * 0.9 + crest * 0.85 + 6;
          dst[dstIdx + 3] = 255;
        }
      }

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
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, [imageUrl, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="w-screen h-screen absolute inset-0 block z-[5]"
      style={{
        maskImage: 'radial-gradient(ellipse 700px 260px at 50% 38%, transparent 30%, black 32%)',
        WebkitMaskImage: 'radial-gradient(ellipse 700px 260px at 50% 38%, transparent 30%, black 32%)',
      }}
    />
  );
};
