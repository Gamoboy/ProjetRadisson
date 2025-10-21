import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Check, Download } from 'lucide-react';

const SignatureCanvas = ({ 
  onSignatureChange, 
  value, 
  disabled = false, 
  width = 400, 
  height = 200,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [signatureData, setSignatureData] = useState('');

  // Configuration du canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size with high DPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    // Scale context for high DPI displays
    ctx.scale(dpr, dpr);

    // Configure drawing style
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 2;

    // Load existing signature if provided
    if (value && value.trim() !== '') {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        setIsEmpty(false);
        setSignatureData(value);
      };
      img.src = value;
    }
  }, [width, height, value]);

  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  // Get pointer position (mouse or touch)
  const getPointerPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = useCallback((e) => {
    if (disabled) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPointerPosition(e);
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setIsEmpty(false);
  }, [disabled]);

  const draw = useCallback((e) => {
    if (!isDrawing || disabled) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPointerPosition(e);
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing, disabled]);

  const stopDrawing = useCallback((e) => {
    if (!isDrawing) return;
    
    e.preventDefault();
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL('image/png');
    setSignatureData(signatureDataUrl);
    
    if (onSignatureChange) {
      onSignatureChange(signatureDataUrl);
    }
  }, [isDrawing, onSignatureChange]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    setSignatureData('');
    
    if (onSignatureChange) {
      onSignatureChange('');
    }
  }, [onSignatureChange]);

  const downloadSignature = useCallback(() => {
    if (!signatureData || isEmpty) return;
    
    const link = document.createElement('a');
    link.download = `signature-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = signatureData;
    link.click();
  }, [signatureData, isEmpty]);

  // Mouse events
  const handleMouseDown = (e) => startDrawing(e);
  const handleMouseMove = (e) => draw(e);
  const handleMouseUp = (e) => stopDrawing(e);
  const handleMouseLeave = (e) => stopDrawing(e);

  // Touch events
  const handleTouchStart = (e) => startDrawing(e);
  const handleTouchMove = (e) => draw(e);
  const handleTouchEnd = (e) => stopDrawing(e);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="signature-canvas w-full max-w-md mx-auto block"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ 
            width: width, 
            height: height,
            cursor: disabled ? 'not-allowed' : 'crosshair'
          }}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={clearSignature}
          disabled={disabled || isEmpty}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          Effacer
        </button>
        
        <button
          onClick={downloadSignature}
          disabled={disabled || isEmpty}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Télécharger
        </button>
        
        {!isEmpty && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Signature valide</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureCanvas;