import React, { useEffect, useState, useRef, useCallback } from 'react';

const TestMonitor = ({ onViolation }) => {
  const [counts, setCounts] = useState({
    tabSwitch: 0,
    mouseLeave: 0,
    keyPress: 0,
  });
  const webcamRef = useRef(null);
  const webcamStream = useRef(null);

  const incrementCount = useCallback((type) => {
    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      incrementCount('tabSwitch');
      onViolation('TAB_SWITCH', 'User switched tabs or minimized window');
    }
  }, [incrementCount, onViolation]);

  const handleMouseLeave = useCallback(() => {
    incrementCount('mouseLeave');
    onViolation('MOUSE_LEAVE', 'Mouse left the browser window');
  }, [incrementCount, onViolation]);

  const handleKeyDown = useCallback((e) => {
    const isCtrlPressed = e.ctrlKey || e.metaKey;
    if (
      (isCtrlPressed && ['c', 'v', 'a', 'f', 'p'].includes(e.key.toLowerCase())) ||
      e.key === 'PrintScreen' ||
      e.key === 'F12' ||
      (isCtrlPressed && e.shiftKey && e.key === 'I')
    ) {
      e.preventDefault();
      incrementCount('keyPress');
      onViolation('SHORTCUT_KEYS', `Restricted key combination used: ${isCtrlPressed ? 'Ctrl+' : ''}${e.key}`);
      return false;
    }
  }, [incrementCount, onViolation]);

  const handleFocus = useCallback(() => {
    console.log('Window focused');
  }, []);

  const handleBlur = useCallback(() => {
    onViolation('FOCUS_LOST', 'Window lost focus');
  }, [onViolation]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    onViolation('RIGHT_CLICK', 'Right-click/context menu attempted');
    return false;
  }, [onViolation]);

  const handleCopy = useCallback((e) => {
    e.preventDefault();
    onViolation('COPY', 'Copy action detected');
    return false;
  }, [onViolation]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    onViolation('PASTE', 'Paste action detected');
    return false;
  }, [onViolation]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [
    handleVisibilityChange,
    handleMouseLeave,
    handleKeyDown,
    handleFocus,
    handleBlur,
    handleContextMenu,
    handleCopy,
    handlePaste,
  ]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 320,
          height: 240,
          facingMode: 'user',
        },
      });

      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }

      webcamStream.current = stream;
    } catch (err) {
      console.error('Error accessing webcam:', err);
      onViolation('WEBCAM_ACCESS', 'Failed to access webcam');
    }
  };

  const stopWebcam = () => {
    if (webcamStream.current) {
      webcamStream.current.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    // Uncomment to enable webcam monitoring
    // startWebcam();

    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="hidden">
      <video ref={webcamRef} autoPlay playsInline muted style={{ display: 'none' }} />
      <div style={{ display: 'none' }}>
        <p>Tab switches: {counts.tabSwitch}</p>
        <p>Mouse leaves: {counts.mouseLeave}</p>
        <p>Restricted key presses: {counts.keyPress}</p>
      </div>
    </div>
  );
};

export default TestMonitor;
