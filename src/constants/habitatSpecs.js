export const habitatSpecifications = {
  modules: [
    {
      name: "Living Quarters",
      dimensions: { width: 5, length: 5, height: 3 },
      features: ["bed", "storage", "window"],
    },
    {
      name: "Laboratory",
      dimensions: { width: 6, length: 6, height: 3 },
      features: ["workbench", "shelves", "equipment"],
    },
    {
      name: "Greenhouse",
      dimensions: { width: 7, length: 7, height: 4 },
      features: ["plants", "hydroponics", "lighting"],
    },
    {
      name: "Common Area",
      dimensions: { width: 8, length: 8, height: 3 },
      features: ["seating", "entertainment", "kitchen"],
    },
  ],
  maxModules: 10,
  minSpacePerModule: 25,
  layoutGuidelines: {
    spacing: 2,
    accessibility: true,
    safety: true,
  },
};