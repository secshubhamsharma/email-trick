import React from 'react';

export default function ResultCard({ email, onCopy }) {
    function copyToClipboard() {
      navigator.clipboard?.writeText(email)
        .then(()=> onCopy(email))
        .catch(()=> {
           const t = document.createElement('textarea');
           t.value = email; document.body.appendChild(t); t.select();
           document.execCommand('copy'); document.body.removeChild(t);
           onCopy(email);
        });
}
  return (
    <div className="card p-3">
      <div className="flex justify-between items-center">
        <div className="text-sm break-all">{email}</div>
        <button className="btn btn-outline btn-sm" onClick={copyToClipboard}>Copy</button>
      </div>
    </div>
  );
}