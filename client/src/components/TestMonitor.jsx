import React from "react";
import TabSwitching from "./Protectors/TabSwitching";
import WebcamMonitor from "./Protectors/WebcamMonitor";

const TestMonitor = () => {
  const handleViolation = (type, message) => {
    console.warn(`Violation: ${type} - ${message}`);
    // Add any additional logic like counting violations
  };

  return (
    <div>
      <TabSwitching onViolation={handleViolation} />
      <WebcamMonitor onViolation={handleViolation} />
    </div>
  );
};

export default TestMonitor;
