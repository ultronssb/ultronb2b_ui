import { useState } from 'react';
import './App.css';
import B2BPagination from './components/B2BPagination';
import B2BTable from './components/B2BTable';
import B2BHeader from './components/B2BHeader';

const PAGE_SIZE = 5;

function App() {
  const [activePage, setPage] = useState(1);

  const headers = [
    { "name": "Element position" },
    { "name": "Element name" },
    { "name": "Symbol" },
    { "name": "Atomic mass" }
  ]
  const elements = [
    { position: 1, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 2, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 3, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 4, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 5, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 8, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 9, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 10, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    { position: 11, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 12, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 13, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 14, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 15, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    { position: 16, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 17, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 18, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 19, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 20, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    { position: 21, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 22, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 23, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 24, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 25, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    { position: 26, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 27, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 28, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 29, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 30, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  ];

  const totalPages = Math.ceil(elements.length / PAGE_SIZE);

  const currentItems = elements.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);


  return (
    <>
      <B2BHeader/>
    </>
  );
}

export default App;
