// src/data/sampleDesigns.js

/**
 * Sample Designs for Community Hub
 * 
 * These pre-made designs appear in the Community Hub when users first visit.
 * They showcase different habitat configurations and mission types.
 * 
 * Each design includes:
 * - Unique ID (sample_X)
 * - Design name and creator
 * - SVG thumbnail (lightweight placeholder)
 * - Mission parameters
 * - Module layout with positions
 * - Creation timestamp
 * - isSample flag (true for samples, false for user designs)
 */

export const sampleDesigns = [
  {
    id: 'sample_1',
    designName: 'Lunar Research Station Alpha',
    creatorName: 'NASA Design Team',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMWEyZSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiM0YTRhNmEiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxNTAiIHI9IjQwIiBmaWxsPSIjNmE2YThhIi8+PGNpcmNsZSBjeD0iMjgwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0iIzZhNmE4YSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkx1bmFyIFN0YXRpb248L3RleHQ+PC9zdmc+',
    missionParams: {
      crewSize: 6,
      destination: 'lunar',
      duration: 'long',
      constructionType: 'rigid'
    },
    modules: [
      { type: 'habitat', position: { x: 0, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'lab', position: { x: -3, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'greenhouse', position: { x: 3, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'power', position: { x: 0, y: 0.5, z: 3 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'storage', position: { x: 0, y: 0.5, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'airlock', position: { x: -3, y: 0.5, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 }
    ],
    createdAt: new Date('2024-01-15T10:30:00'),
    isSample: true
  },
  {
    id: 'sample_2',
    designName: 'Mars Colony Outpost',
    creatorName: 'SpaceX Architecture',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJhMWExYSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNzAiIGZpbGw9IiM2YTNhM2EiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSIxMjAiIHI9IjM1IiBmaWxsPSIjOGE0YTRhIi8+PGNpcmNsZSBjeD0iMjcwIiBjeT0iMTIwIiByPSIzNSIgZmlsbD0iIzhhNGE0YSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIyMCIgcj0iMzAiIGZpbGw9IiM4YTRhNGEiLz48dGV4dCB4PSIyMDAiIHk9IjI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NYXJzIE91dHBvc3Q8L3RleHQ+PC9zdmc+',
    missionParams: {
      crewSize: 4,
      destination: 'mars',
      duration: 'long',
      constructionType: 'inflatable'
    },
    modules: [
      { type: 'living', position: { x: 0, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'lab', position: { x: -2.5, y: 0.5, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'lab', position: { x: 2.5, y: 0.5, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'greenhouse', position: { x: 0, y: 0.5, z: 3 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 }
    ],
    createdAt: new Date('2024-01-10T14:20:00'),
    isSample: true
  },
  {
    id: 'sample_3',
    designName: 'ISS Next Generation',
    creatorName: 'International Collaboration',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzBhMGEyYSIvPjxsaW5lIHgxPSI1MCIgeTE9IjE1MCIgeDI9IjM1MCIgeTI9IjE1MCIgc3Ryb2tlPSIjNGE0YTZhIiBzdHJva2Utd2lkdGg9IjMwIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUwIiByPSIzNSIgZmlsbD0iIzZhNmE4YSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNDUiIGZpbGw9IiM2YTZhOGEiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSIxNTAiIHI9IjM1IiBmaWxsPSIjNmE2YThhIi8+PHRleHQgeD0iMjAwIiB5PSIyNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SVNTIE5leHQgR2VuPC90ZXh0Pjwvc3ZnPg==',
    missionParams: {
      crewSize: 8,
      destination: 'leo',
      duration: 'permanent',
      constructionType: 'modular'
    },
    modules: [
      { type: 'habitat', position: { x: -4, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'living', position: { x: 0, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'lab', position: { x: 4, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'medical', position: { x: 0, y: 0.5, z: -3 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'power', position: { x: 0, y: 0.5, z: 3 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 }
    ],
    createdAt: new Date('2024-01-05T09:15:00'),
    isSample: true
  },
  {
    id: 'sample_4',
    designName: 'Compact Research Pod',
    creatorName: 'ESA Innovation Lab',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMWEzYSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNjAiIGZpbGw9IiM0YTRhN2EiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjNmE2YThhIi8+PGNpcmNsZSBjeD0iMjUwIiBjeT0iMTUwIiByPSIzMCIgZmlsbD0iIzZhNmE4YSIvPjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJlc2VhcmNoIFBvZDwvdGV4dD48L3N2Zz4=',
    missionParams: {
      crewSize: 2,
      destination: 'lunar',
      duration: 'short',
      constructionType: 'rigid'
    },
    modules: [
      { type: 'habitat', position: { x: 0, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'lab', position: { x: -2, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'airlock', position: { x: 2, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 }
    ],
    createdAt: new Date('2024-01-20T16:45:00'),
    isSample: true
  },
  {
    id: 'sample_5',
    designName: 'Deep Space Gateway',
    creatorName: 'Blue Origin Team',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzBhMGExYSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iOTAiIGZpbGw9IiMzYTNhNWEiLz48Y2lyY2xlIGN4PSIxNDAiIGN5PSIxMDAiIHI9IjM1IiBmaWxsPSIjNWE1YTdhIi8+PGNpcmNsZSBjeD0iMjYwIiBjeT0iMTAwIiByPSIzNSIgZmlsbD0iIzVhNWE3YSIvPjxjaXJjbGUgY3g9IjE0MCIgY3k9IjIwMCIgcj0iMzUiIGZpbGw9IiM1YTVhN2EiLz48Y2lyY2xlIGN4PSIyNjAiIGN5PSIyMDAiIHI9IjM1IiBmaWxsPSIjNWE1YTdhIi8+PHRleHQgeD0iMjAwIiB5PSIxNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R2F0ZXdheTwvdGV4dD48L3N2Zz4=',
    missionParams: {
      crewSize: 10,
      destination: 'leo',
      duration: 'permanent',
      constructionType: 'modular'
    },
    modules: [
      { type: 'habitat', position: { x: 0, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'living', position: { x: -3, y: 0.5, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'living', position: { x: 3, y: 0.5, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'lab', position: { x: -3, y: 0.5, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'lab', position: { x: 3, y: 0.5, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'medical', position: { x: 0, y: 0.5, z: -4 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 },
      { type: 'greenhouse', position: { x: 0, y: 0.5, z: 4 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, floor: 0 }
    ],
    createdAt: new Date('2023-12-28T11:00:00'),
    isSample: true
  }
];
