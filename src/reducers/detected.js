const initalState = {
  detectedFloor: null,
  detectedRegions: [],
  detectedBeaconsByRegions: {},
  // Only useful for testing:
  allDetectedBeacons: [],
};

const detected = (state = initalState, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default detected;
