import React, { useState } from 'react';
import { Card, Button } from '@heroui/react'; // Import HeroUI components
import { motion } from 'framer-motion'; // For animations
import { Copy, Check } from 'lucide-react'; // Icons for copy button
import toast from 'react-hot-toast'; // For toast notifications

function ResultCard({ email, onCopy }) {
  const [copied, setCopied] = useState(false); // State to track if the email has been copied

  // Function to copy text to clipboard with a fallback mechanism
  const copyToClipboard = () => {
    // Attempt to use the modern Clipboard API (preferred)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => {
          setCopied(true); // Set copied state to true
          onCopy(email); // Call the parent's onCopy callback
          setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
        })
        .catch(err => {
          console.error('Failed to copy using Clipboard API:', err);
          // Fallback to document.execCommand if Clipboard API fails
          fallbackCopyToClipboard();
        });
    } else {
      // Fallback for environments where Clipboard API is not available
      fallbackCopyToClipboard();
    }
  };

  // Fallback function for copying text using a temporary textarea
  const fallbackCopyToClipboard = () => {
    const textarea = document.createElement('textarea');
    textarea.value = email;
    // Make the textarea invisible and append it to the document
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select(); // Select the text in the textarea
    try {
      document.execCommand('copy'); // Execute the copy command
      setCopied(true); // Set copied state to true
      onCopy(email); // Call the parent's onCopy callback
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Fallback: Failed to copy text:', err);
      toast.error('Failed to copy email.'); // Show error toast if fallback also fails
    } finally {
      document.body.removeChild(textarea); // Always remove the temporary textarea
    }
  };

  return (
    // Motion.div for entry/exit animations of the card
    <motion.div
      initial={{ opacity: 0, y: 10 }} // Initial animation state (invisible, slightly down)
      animate={{ opacity: 1, y: 0 }} // Animation to (fully visible, normal position)
      exit={{ opacity: 0, y: -10 }} // Exit animation (fade out, move slightly up)
      transition={{ duration: 0.3 }} // Animation duration
    >
      {/* HeroUI Card component for each result item */}
      <Card className="p-4 flex justify-between items-center bg-zinc-100 dark:bg-zinc-700 rounded-lg shadow-sm">
        {/* Display the email, allowing it to break lines if long */}
        <div className="text-sm break-all font-mono text-zinc-800 dark:text-zinc-200 pr-2">
          {email}
        </div>
        {/* HeroUI Button for copying the email */}
        <Button
          isIconOnly // Make it an icon-only button
          variant="ghost" // Subtle ghost variant
          color={copied ? "success" : "default"} // Change color based on copied state
          onClick={copyToClipboard}
          className="min-w-[36px] min-h-[36px]" // Ensure minimum touch target size
          aria-label={copied ? "Copied" : "Copy email"} // Accessibility label
        >
          {/* Display Check icon if copied, otherwise Copy icon */}
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </Button>
      </Card>
    </motion.div>
  );
}

export default ResultCard;
