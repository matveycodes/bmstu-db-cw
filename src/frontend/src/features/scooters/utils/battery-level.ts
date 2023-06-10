const getBatteryLevelColor = (batteryLevel: number) => {
  if (batteryLevel < 10) {
    return "red";
  } else if (batteryLevel < 25) {
    return "orange";
  } else if (batteryLevel < 50) {
    return "yellow";
  }

  return "green";
};

export { getBatteryLevelColor };
