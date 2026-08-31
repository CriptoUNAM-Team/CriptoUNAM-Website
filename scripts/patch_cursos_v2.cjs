const fs = require('fs');
const path = 'src/pages/Cursos.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add framer-motion import
if (!content.includes("import { motion }")) {
  content = content.replace("import { useState, useMemo, useEffect } from 'react'", "import { useState, useMemo, useEffect } from 'react'\nimport { motion } from 'framer-motion'");
}

// 2. Add more icons
const oldIcons = `  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'`;
const newIcons = `  faCheckCircle,
  faLock,
  faShieldHalved,
  faDatabase,
  faNetworkWired,
  faMoneyBillTrendUp,
  faPenNib,
  faMicrochip,
  faCubes,
} from '@fortawesome/free-solid-svg-icons'`;
content = content.replace(oldIcons, newIcons);

// 3. Update getCourseIcon
const oldGetCourseIcon = `const getCourseIcon = (categorias: string[]) => {
  const cats = categorias.map(c => c.toLowerCase())
  if (cats.some(c => ['desarrollo', 'smart contracts', 'rust', 'move', 'backend', 'apis'].includes(c))) return faCode
  if (cats.some(c => ['defi', 'finanzas', 'trading', 'tokenomics', 'economía', 'cetes'].includes(c))) return faChartLine
  if (cats.some(c => ['diseño', 'ux', 'producto', 'figma', 'canva'].includes(c))) return faPalette
  if (cats.some(c => ['ia', 'claude', 'anthropic', 'vibecoding'].includes(c))) return faRobot
  if (cats.some(c => ['blockchain', 'ethereum', 'l2', 'arbitrum', 'solana', 'avalanche', 'stellar', 'sui'].includes(c))) return faCube
  return faBook
}`;
const newGetCourseIcon = `const getCourseIcon = (categorias: string[]) => {
  const cats = categorias.map(c => c.toLowerCase())
  if (cats.some(c => ['seguridad', 'criptografía'].includes(c))) return faShieldHalved
  if (cats.some(c => ['backend', 'indexers', 'database'].includes(c))) return faDatabase
  if (cats.some(c => ['arquitectura', 'oráculos', 'network'].includes(c))) return faNetworkWired
  if (cats.some(c => ['desarrollo', 'smart contracts', 'rust', 'move', 'apis'].includes(c))) return faCode
  if (cats.some(c => ['defi', 'finanzas', 'trading', 'cetes'].includes(c))) return faMoneyBillTrendUp
  if (cats.some(c => ['tokenomics', 'economía', 'negocio', 'growth', 'marketing'].includes(c))) return faChartLine
  if (cats.some(c => ['diseño', 'ux', 'producto', 'figma', 'canva'].includes(c))) return faPenNib
  if (cats.some(c => ['ia', 'claude', 'anthropic', 'vibecoding'].includes(c))) return faMicrochip
  if (cats.some(c => ['blockchain', 'ethereum', 'l2', 'arbitrum', 'solana', 'avalanche', 'stellar', 'sui', 'rollups', 'subnets'].includes(c))) return faCubes
  return faBook
}`;
content = content.replace(oldGetCourseIcon, newGetCourseIcon);

// 4. Update grid CSS
const oldGrid = `.cursos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 480px) {
          .cursos-grid { grid-template-columns: 1fr; }
        }`;
const newGrid = `.cursos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
        }
        @media (max-width: 640px) {
          .cursos-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
        }`;
content = content.replace(oldGrid, newGrid);

// 5. Update card rendering
const oldCardRegex = /<article[\s\S]*?<\/article>/g;

// We need to replace the mapping logic carefully. Let's do it with string replacement.
fs.writeFileSync(path, content);
