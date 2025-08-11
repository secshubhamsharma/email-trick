import React, { useState } from "react";
import { Card, Input, Button, RadioGroup, Radio } from "@heroui/react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Wand2, RotateCcw } from "lucide-react";
import { generateDotVariants, generatePlusVariants } from "../utils/generators";

function GeneratorForm({ onResults }) {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("dot");
  const [limit, setLimit] = useState(200);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (inputEmail) => {
    if (!inputEmail) return "Email cannot be empty.";
    const parts = inputEmail.split("@");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return "Please enter a valid email address (e.g., name@domain.com).";
    }
    const [, domain] = parts;
    if (mode === "dot" && !domain.toLowerCase().includes("gmail")) {
      return "Gmail Dot Trick only works for Gmail addresses.";
    }
    return "";
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      toast.error(error);
      return;
    }
    setEmailError("");
    setIsGenerating(true);

    const [local, domain] = email.split("@");
    try {
      const results =
        mode === "dot"
          ? generateDotVariants(local.replace(/\./g, ""), domain, limit)
          : generatePlusVariants(local, domain, { limit });

      onResults(results);
      toast.success(`Generated ${results.length} email variants!`);
    } catch (err) {
      toast.error("An error occurred during generation.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setEmail("");
    setMode("dot");
    setLimit(200);
    setEmailError("");
    onResults([]);
    toast.info("Form reset!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center items-start py-10 px-4"
    >
      <Card className="p-8 w-full max-w-3xl shadow-2xl bg-light_card dark:bg-dark_card rounded-2xl text-light_text dark:text-dark_text border border-primary/20">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center tracking-tight">
          Email Trick Generator
        </h2>

        {/* Email Input */}
        <Input
          label="Enter Your Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(validateEmail(e.target.value));
          }}
          placeholder="e.g. johnsmith@gmail.com"
          isInvalid={!!emailError}
          errorMessage={emailError}
          size="lg"
          variant="bordered"
          color="primary"
          radius="lg"
          className="mb-6"
        />

        {/* Mode Selection */}
        <div className="mb-6">
          <p className="mb-3 font-semibold text-lg text-center">
            Select Email Trick
          </p>
          <RadioGroup
            value={mode}
            onValueChange={setMode}
            orientation="horizontal"
            className="flex flex-wrap justify-center gap-6"
            color="primary"
          >
            <div className="px-4 py-2 border rounded-xl shadow-sm hover:shadow-md transition-all min-w-[150px] flex-1 flex items-center justify-center">
              <Radio
                value="dot"
                className="w-full flex items-center justify-center"
              >
                Gmail Dot Trick
              </Radio>
            </div>
            <div className="px-4 py-2 border rounded-xl shadow-sm hover:shadow-md transition-all min-w-[150px] flex-1 flex items-center justify-center">
              <Radio
                value="plus"
                className="w-full flex items-center justify-center"
              >
                Business + Tag
              </Radio>
            </div>
          </RadioGroup>
        </div>

        {/* Limit Input */}
        <Input
          label="Max Results"
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          min={1}
          size="lg"
          variant="bordered"
          color="primary"
          radius="lg"
          className="mb-8"
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            color="primary"
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={isGenerating || !!emailError}
            size="lg"
            radius="lg"
            className="font-semibold flex items-center gap-2"
          >
            <Wand2 size={18} />
            {isGenerating ? "Generating..." : "Generate Variants"}
          </Button>
          <Button
            variant="flat"
            color="default"
            onClick={handleReset}
            disabled={isGenerating}
            size="lg"
            radius="lg"
            className="font-semibold flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Reset
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export default GeneratorForm;
