import React, { useState } from 'react';
import GeneratorForm from './components/GeneratorForm';
import ResultCard from './components/ResultCard';
import { motion } from 'framer-motion';

export default function App() {
  const [results, setResults] = useState([]);
  const [toast, setToast] = useState('');

  function handleCopy(email) {
    setToast(`Copied ${email}`);
    setTimeout(()=> setToast(''), 2000);
  }

  return (
    <div className="min-h-screen p-8 bg-base-200">
      <div className="max-w-4xl mx-auto">
        <GeneratorForm onResults={setResults} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {results.map(r => (
            <motion.div key={r} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}>
              <ResultCard email={r} onCopy={handleCopy} />
            </motion.div>
          ))}
        </div>

        {toast && <div className="toast toast-top toast-center"><div className="alert alert-success">{toast}</div></div>}
      </div>
    </div>
  );
}
