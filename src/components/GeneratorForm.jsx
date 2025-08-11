import React, { useState } from 'react';
import { Card, Input, Button, RadioGroup, Radio } from '@heroui/react'; // Import HeroUI components
import toast from 'react-hot-toast'; // For form validation feedback

// Import the utility functions for generating email variants
import { generateDotVariants, generatePlusVariants } from '../utils/generators';

function GeneratorForm({ onResults }) {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('dot'); // 'dot' or 'plus'
  const [limit, setLimit] = useState(200); // Max results for dot trick
  const [rangeStart, setRangeStart] = useState(1); // Start of range for plus trick
  const [rangeEnd, setRangeEnd] = useState(50); // End of range for plus trick
  const [customTags, setCustomTags] = useState(''); // Custom tags for plus trick (comma-separated)
  const [isGenerating, setIsGenerating] = useState(false); // Loading state for generate button
  const [emailError, setEmailError] = useState(''); // State for email input validation error

  // Function to validate the email input
  const validateEmail = (inputEmail) => {
    if (!inputEmail) {
      return "Email cannot be empty.";
    }
    const parts = inputEmail.split('@');
    // Check if email has local part and domain part
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return "Please enter a valid email address (e.g., name@domain.com).";
    }
    const [local, domain] = parts;
    // Specific validation for Gmail Dot Trick
    if (mode === 'dot' && !domain.toLowerCase().includes('gmail')) {
      return "Gmail Dot Trick only works for Gmail addresses.";
    }
    return ''; // Return empty string if no error
  };

  // Handle the generate button click
  function handleGenerate(e) {
    e.preventDefault(); // Prevent default form submission

    // Validate email before proceeding
    const error = validateEmail(email);
    if (error) {
      setEmailError(error); // Set error message
      toast.error(error); // Show error toast
      return; // Stop function execution
    } else {
      setEmailError(''); // Clear error if validation passes
    }

    setIsGenerating(true); // Set loading state
    const [local, domain] = email.split('@');
    let results = [];

    try {
      if (mode === 'dot') {
        // Generate dot variants, removing any existing dots from the local part
        results = generateDotVariants(local.replace(/\./g, ''), domain, limit);
      } else {
        // Generate plus variants with specified range and custom tags
        results = generatePlusVariants(local, domain, { start: Number(rangeStart), end: Number(rangeEnd), customTags });
      }
      onResults(results); // Pass generated results back to App.jsx
      toast.success(`Generated ${results.length} email variants!`); // Success toast
    } catch (err) {
      toast.error("An error occurred during generation."); // Error toast
      console.error("Generation error:", err); // Log the error for debugging
    } finally {
      setIsGenerating(false); // Reset loading state
    }
  }

  return (
    // HeroUI Card component for the form, with styling for responsiveness and dark mode
    <Card className="p-8 shadow-lg w-full max-w-2xl mx-auto dark:bg-zinc-800 bg-white rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-zinc-900 dark:text-white">Email Trick Generator</h2>

      {/* HeroUI Input component for email, with built-in validation feedback */}
      <Input
        label="Your Email"
        type="email"
        value={email}
        onChange={e => {
          setEmail(e.target.value);
          setEmailError(validateEmail(e.target.value)); // Real-time validation on change
        }}
        placeholder="johnsmith@gmail.com"
        isInvalid={!!emailError} // Set isInvalid prop based on error state
        errorMessage={emailError} // Display error message
        className="mb-6"
        size="lg"
        variant="bordered"
      />

      {/* HeroUI RadioGroup for selecting the trick mode */}
      <RadioGroup
        value={mode}
        onValueChange={setMode}
        orientation="horizontal" // Arrange radios horizontally
        className="mb-6 flex justify-center gap-6"
        label="Choose a trick:"
      >
        <Radio value="dot" color="primary">Gmail Dot Trick</Radio>
        <Radio value="plus" color="primary">Business + Tag</Radio>
      </RadioGroup>

      {/* Conditional rendering for trick-specific inputs */}
      {mode === 'dot' ? (
        <Input
          label="Max results (combinatorial explosion!)"
          type="number"
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
          className="mb-6"
          min={1}
          max={1000} // Set a reasonable max limit to prevent excessive calculations
          size="md"
          variant="bordered"
        />
      ) : (
        <>
          <Input
            label="Plus Tag Range Start"
            type="number"
            value={rangeStart}
            onChange={e => setRangeStart(Number(e.target.value))}
            className="mb-4"
            min={0}
            size="md"
            variant="bordered"
          />
          <Input
            label="Plus Tag Range End"
            type="number"
            value={rangeEnd}
            onChange={e => setRangeEnd(Number(e.target.value))}
            className="mb-4"
            min={1}
            size="md"
            variant="bordered"
          />
          <Input
            label="Custom Tags (comma-separated, e.g., work, personal)"
            type="text"
            value={customTags}
            onChange={e => setCustomTags(e.target.value)}
            className="mb-6"
            placeholder="e.g., newsletter, marketing, test"
            size="md"
            variant="bordered"
          />
        </>
      )}

      {/* Action buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          color="primary" // Primary color for the main action
          onClick={handleGenerate}
          isLoading={isGenerating} // Show loading spinner if generating
          disabled={isGenerating || !!emailError} // Disable if generating or if there's an email error
          className="w-full sm:w-auto"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
        <Button
          variant="bordered" // Bordered variant for secondary action
          color="secondary"
          onClick={() => {
            // Reset all form states to initial values
            setEmail('');
            setMode('dot');
            setLimit(200);
            setRangeStart(1);
            setRangeEnd(50);
            setCustomTags('');
            setEmailError('');
            onResults([]); // Clear results in App.jsx
            toast.info("Form reset!"); // Info toast
          }}
          className="w-full sm:w-auto"
          disabled={isGenerating} // Disable reset button while generating
        >
          Reset
        </Button>
      </div>
    </Card>
  );
}

export default GeneratorForm;
