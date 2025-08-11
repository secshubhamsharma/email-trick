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
  <Card className="px-4 py-2 flex flex-row items-center justify-between flex-nowrap bg-light_card dark:bg-dark_card rounded-lg shadow-sm border border-primary-500/20">
  <div className="text-sm break-all font-mono text-light_text dark:text-dark_text flex-grow">
    {email}
  </div>
  <Button
    isIconOnly
    variant="ghost"
    color={copied ? "success" : "default"}
    onClick={copyToClipboard}
    className="min-w-[32px] min-h-[32px] flex-shrink-0"
    aria-label={copied ? "Copied" : "Copy email"}
  >
    {copied ? <Check size={16} /> : <Copy size={16} />}
  </Button>
</Card>

    </motion.div>
  );
}

export default ResultCard;
