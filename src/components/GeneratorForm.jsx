import React, { useState } from 'react';
import { Card, Input, Button, RadioGroup, Radio } from '@heroui/react';
import toast from 'react-hot-toast';

import { generateDotVariants, generatePlusVariants } from '../utils/generators';

function GeneratorForm({ onResults }) {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('dot'); 
  const [limit, setLimit] = useState(200); 
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(50); 
  const [customTags, setCustomTags] = useState(''); 
  const [isGenerating, setIsGenerating] = useState(false); 
  const [emailError, setEmailError] = useState('');

  const validateEmail = (inputEmail) => {
    if (!inputEmail) {
      return "Email cannot be empty.";
    }
    const parts = inputEmail.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return "Please enter a valid email address (e.g., name@domain.com).";
    }
    const [local, domain] = parts;
    if (mode === 'dot' && !domain.toLowerCase().includes('gmail')) {
      return "Gmail Dot Trick only works for Gmail addresses.";
    }
    return '';
  };

  function handleGenerate(e) {
    e.preventDefault();

    const error = validateEmail(email);
    if (error) {
      setEmailError(error); 
      toast.error(error); 
      return; 
    } else {
      setEmailError(''); 
    }

    setIsGenerating(true); 
    const [local, domain] = email.split('@');
    let results = [];

    try {
      if (mode === 'dot') {
        results = generateDotVariants(local.replace(/\./g, ''), domain, limit);
      } else {
        results = generatePlusPlusVariants(local, domain, { start: Number(rangeStart), end: Number(rangeEnd), customTags });
      }
      onResults(results); 
      toast.success(`Generated ${results.length} email variants!`); 
    } catch (err) {
      toast.error("An error occurred during generation."); 
      console.error("Generation error:", err); 
    } finally {
      setIsGenerating(false); 
    }
  }

  return (
    <Card className="p-8 shadow-lg w-full max-w-2xl mx-auto bg-light_card dark:bg-dark_card rounded-xl text-light_text dark:text-dark_text">
      <h2 className="text-2xl font-bold mb-6 text-center">Email Trick Generator</h2>

      <Input
        label="Your Email"
        type="email"
        value={email}
        onChange={e => {
          setEmail(e.target.value);
          setEmailError(validateEmail(e.target.value));
        }}
        placeholder="johnsmith@gmail.com"
        isInvalid={!!emailError} 
        errorMessage={emailError} 
        className="mb-6"
        size="lg"
        variant="faded"
        color="primary"
      />

      <RadioGroup
        value={mode}
        onValueChange={setMode}
        orientation="horizontal"
        className="mb-6 flex justify-center gap-6"
        label="Choose a trick:"
        color="primary"
      >
        <Radio value="dot">Gmail Dot Trick</Radio>
        <Radio value="plus">Business + Tag</Radio>
      </RadioGroup>

      {mode === 'dot' ? (
        <Input
          label="Max results (combinatorial explosion!)"
          type="number"
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
          className="mb-6"
          min={1}
          max={1000} 
          size="md"
          variant="faded"
          color="primary"
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
            variant="faded"
            color="primary"
          />
          <Input
            label="Plus Tag Range End"
            type="number"
            value={rangeEnd}
            onChange={e => setRangeEnd(Number(e.target.value))}
            className="mb-4"
            min={1}
            size="md"
            variant="faded"
            color="primary"
          />
          <Input
            label="Custom Tags (comma-separated, e.g., work, personal)"
            type="text"
            value={customTags}
            onChange={e => setCustomTags(e.target.value)}
            className="mb-6"
            placeholder="e.g., newsletter, marketing, test"
            size="md"
            variant="faded"
            color="primary"
          />
        </>
      )}

      <div className="flex gap-4 justify-center">
        <Button
          color="primary" 
          onClick={handleGenerate}
          isLoading={isGenerating} 
          disabled={isGenerating || !!emailError} 
          className="w-full sm:w-auto font-semibold"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
        <Button
          variant="bordered"
          color="default"
          onClick={() => {
            setEmail('');
            setMode('dot');
            setLimit(200);
            setRangeStart(1);
            setRangeEnd(50);
            setCustomTags('');
            setEmailError('');
            onResults([]);
            toast.info("Form reset!");
          }}
          className="w-full sm:w-auto font-semibold"
          disabled={isGenerating}
        >
          Reset
        </Button>
      </div>
    </Card>
  );
}

export default GeneratorForm;
