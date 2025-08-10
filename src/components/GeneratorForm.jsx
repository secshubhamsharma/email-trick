import React, { useState } from 'react';
import { generateDotVariants, generatePlusVariants } from '../utils/generators';

export default function GeneratorForm({ onResults }) {
    const [email, setEmail] = useState('');
    const [mode, setMode] = useState('dot');
    const [limit, setLimit] = useState(200);
    const [rangeEnd, setRangeEnd] = useState(50);

  function handleGenerate(e) {
    e.preventDefault();
    const [local, domain] = email.split('@');
    if (!local || !domain) return alert('Enter a valid email like name@gmail.com');
    let results = [];
    if (mode === 'dot') {
      results = generateDotVariants(local.replace(/\./g,''), domain, limit);
    } else {
      results = generatePlusVariants(local, domain, { end: Number(rangeEnd) });
    }
    onResults(results);
  }

  return (
    <form className="card p-6 shadow-lg" onSubmit={handleGenerate}>
      <h2 className="text-xl font-semibold mb-4">Email trick generator</h2>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="shubham@gmail.com" className="input input-bordered w-full mb-3" />
      <div className="flex gap-4 mb-3">
        <label className="cursor-pointer"><input type="radio" name="mode" checked={mode==='dot'} onChange={()=>setMode('dot')} /> Gmail Dot Trick</label>
        <label className="cursor-pointer"><input type="radio" name="mode" checked={mode==='plus'} onChange={()=>setMode('plus')} /> Business + Tag</label>
      </div>

      {mode==='dot' ? (
        <label className="block mb-3">Max results <input type="number" value={limit} onChange={e=>setLimit(e.target.value)} className="input input-sm ml-2 w-24" /></label>
      ) : (
        <label className="block mb-3">Range end <input type="number" value={rangeEnd} onChange={e=>setRangeEnd(e.target.value)} className="input input-sm ml-2 w-24" /></label>
      )}

      <div className="flex gap-2">
        <button className="btn btn-primary" type="submit">Generate</button>
        <button type="button" className="btn" onClick={()=>{ setEmail(''); setMode('dot'); onResults([]) }}>Reset</button>
      </div>
    </form>
  );
}