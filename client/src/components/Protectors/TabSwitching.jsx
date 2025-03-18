import { useEffect, useCallback, useState, use } from "react";
import { useNavigate } from "react-router-dom";

const TabSwitching = ({ onViolation }) => {
  const [counts, setCounts] = useState({
    tabSwitch: 0,
    mouseLeave: 0,
    keyPress: 0,
  });

  const [warningCount, setWarningCount] = useState(0);
  const navigate = useNavigate();

  const incrementCount = useCallback((type) => {
    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  }, []);

  const issueWarning = () => {
    setWarningCount((prev) => prev + 1);
  }

  useEffect(() => {
    if (warningCount >= 3) {
      setWarningCount(0);
      alert("You have been disqualified due to multiple violations.");
      navigate("/Dashboard"); // Redirect to Dashboard page
    }
  }, [warningCount]);


  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "hidden") {
      incrementCount("tabSwitch");
      onViolation("TAB_SWITCH", "User switched tabs or minimized window");
      issueWarning();
    }
  }, [incrementCount, onViolation, issueWarning]);

  const handleMouseLeave = useCallback(() => {
    incrementCount("mouseLeave");
    onViolation("MOUSE_LEAVE", "Mouse left the browser window");
    issueWarning();
  }, [incrementCount, onViolation, issueWarning]);

  const handleKeyDown = useCallback(
    (e) => {
      const isCtrlPressed = e.ctrlKey || e.metaKey;
      if (
        (isCtrlPressed && ["c", "v", "a", "f", "p"].includes(e.key.toLowerCase())) ||
        e.key === "PrintScreen" ||
        e.key === "F12" ||
        (isCtrlPressed && e.shiftKey && e.key === "I")
      ) {
        e.preventDefault();
        incrementCount("keyPress");
        onViolation("SHORTCUT_KEYS", `Restricted key combination used: ${isCtrlPressed ? "Ctrl+" : ""}${e.key}`);
        issueWarning();
        return false;
      }
    },
    [incrementCount, onViolation, issueWarning]
  );

  const handleFocus = useCallback(() => {
    console.log("Window focused");
  }, []);

  const handleBlur = useCallback(() => {
    onViolation("FOCUS_LOST", "Window lost focus");
    issueWarning();
  }, [onViolation, issueWarning]);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      onViolation("RIGHT_CLICK", "Right-click/context menu attempted");
      issueWarning();
      return false;
    },
    [onViolation, issueWarning]
  );

  const handleCopy = useCallback(
    (e) => {
      e.preventDefault();
      onViolation("COPY", "Copy action detected");
      issueWarning();
      return false;
    },
    [onViolation, issueWarning]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      onViolation("PASTE", "Paste action detected");
      issueWarning();
      return false;
    },
    [onViolation, issueWarning]
  );

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, [handleVisibilityChange, handleMouseLeave, handleKeyDown, handleFocus, handleBlur, handleContextMenu, handleCopy, handlePaste]);

  return null;
};

export default TabSwitching;
