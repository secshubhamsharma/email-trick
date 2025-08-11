import React, { useState } from 'react';
import { Card, Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

function ResultCard({ email, onCopy }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => {
          setCopied(true);
          onCopy(email);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy using Clipboard API:', err);
          fallbackCopyToClipboard();
        });
    } else {
      fallbackCopyToClipboard();
    }
  };

  const fallbackCopyToClipboard = () => {
    const textarea = document.createElement('textarea');
    textarea.value = email;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      onCopy(email);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Fallback: Failed to copy text:', err);
      toast.error('Failed to copy email.');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 flex justify-between items-center bg-zinc-100 dark:bg-zinc-700 rounded-lg shadow-sm">
        <div className="text-sm break-all font-mono text-zinc-800 dark:text-zinc-200 pr-2">
          {email}
        </div>
        <Button
          isIconOnly 
          variant="ghost"
          color={copied ? "success" : "default"}
          onClick={copyToClipboard}
          className="min-w-[36px] min-h-[36px]"
          aria-label={copied ? "Copied" : "Copy email"}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </Button>
      </Card>
    </motion.div>
  );
}

export default ResultCard;
