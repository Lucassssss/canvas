export const DIMENSIONS = {
  // 1. Base Slot Dimensions (Used by AI Combination & Custom Combination)
  // Aspect Ratio: 3:4
  SLOT: { width: 144, height: 192 }, 

  // 2. Drag & Drop Floating Ghost Size & Default Canvas Image size
  // 2x the slot size for usability and precise interaction
  IMAGE: { width: 288, height: 384 }, 
  
  // Existing standard defaults
  SHAPE: { width: 200, height: 200 },
  TEXT: { width: 200, height: 50 },
  NOTE: { width: 200, height: 150 },
  CLOTHING: { width: 800, height: 800 },
  DETAIL_IMAGE: { width: 400, height: 280 },

  // Layout metrics
  COMBINATION: {
    GAP: 16,
    PADDING: 20,
    CREATE_GAP: 60 // The spacing below previous item when auto-spawning
  }
}
