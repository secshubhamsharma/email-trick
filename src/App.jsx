import React, { useState, useEffect } from 'react';
import { Card, Button } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import GeneratorForm from './components/GeneratorForm';
import ResultCard from './components/ResultCard';

function App() {
  const [results, setResults] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (prefersDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  function handleCopyIndividual(email) {
    navigator.clipboard.writeText(email)
      .then(() => toast.success(`Copied: ${email}`))
      .catch(() => toast.error("Failed to copy email."));
  }

  function handleCopyAll() {
    if (results.length === 0) {
      toast.error("No emails to copy!");
      return;
    }
    const allEmails = results.join('\n');
    navigator.clipboard.writeText(allEmails)
      .then(() => toast.success(`Copied ${results.length} emails!`))
      .catch(() => toast.error("Failed to copy all emails."));
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-8 ${theme === 'dark' ? 'bg-dark_background text-dark_text' : 'bg-light_background text-light_text'} transition-colors duration-300 font-inter`}>
      <div className="max-w-6xl mx-auto w-full">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            isIconOnly
            variant="ghost"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-primary-400 hover:text-primary-500"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>

        {/* Form */}
        <GeneratorForm onResults={(newResults) => {
          setResults(newResults);
          setCurrentPage(1);
        }} />

        {/* Results */}
        {results.length > 0 && (
          <Card className={`mt-8 p-6 shadow-lg rounded-xl ${theme === 'dark' ? 'bg-dark_card text-dark_text' : 'bg-light_card text-light_text'}`}>
            <h3 className="text-xl font-bold mb-4">Generated Emails ({results.length})</h3>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <Button
                color="primary"
                onClick={handleCopyAll}
                startContent={<Clipboard size={16} />}
                className="w-full sm:w-auto font-semibold"
              >
                Copy All ({results.length})
              </Button>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    variant="flat"
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                    aria-label="Previous page"
                    color="primary"
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                  <Button
                    isIconOnly
                    variant="flat"
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                    aria-label="Next page"
                    color="primary"
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {currentResults.map(r => (
                  <ResultCard key={r} email={r} onCopy={handleCopyIndividual} />
                ))}
              </AnimatePresence>
            </div>
          </Card>
        )}
      </div>

{/* Footer */}
<footer className="mt-12 border-t border-primary-500/20 pt-6 text-center">
  <p className="text-sm mb-3 text-light_text dark:text-dark_text">
    Developed by <span className="font-semibold">Shubham Sharma</span>
  </p>
  <div className="flex justify-center gap-4">
    {/* LinkedIn */}
    <a
      href="https://linkedin.com/in/secshubhamsharma"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      className="text-black dark:text-white hover:text-primary-500 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 1.146C0 .513.324 0 .725 0h14.55c.401 0 .725.513.725 1.146v13.708c0 .633-.324 1.146-.725 1.146H.725A.723.723 0 0 1 0 14.854V1.146zM4.943 12.306V6.169H3.121v6.137h1.822zm-.911-7.06c.607 0 .984-.403.984-.905 0-.514-.377-.905-.984-.905C3.426 3.436 3 3.827 3 4.341c0 .502.426.905 1.032.905zM13 12.306V8.724c0-1.91-1.021-2.8-2.382-2.8-1.093 0-1.579.602-1.853 1.027V6.17H6.943c.024.537 0 6.137 0 6.137h1.822V8.89c0-.183.013-.366.067-.497.148-.365.485-.744 1.051-.744.741 0 1.037.56 1.037 1.38v3.277H13z"/>
      </svg>
    </a>

    {/* GitHub */}
    <a
      href="https://github.com/secshubhamsharma"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
      className="text-black dark:text-white hover:text-primary-500 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0C3.58 0 0 3.582 0 8.004c0 3.535 2.292 6.532 5.47 7.594.4.074.547-.172.547-.384 0-.19-.007-.693-.01-1.36-2.226.484-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.728-.498.055-.488.055-.488.806.056 1.23.83 1.23.83.716 1.226 1.877.872 2.334.667.073-.518.28-.872.508-1.073-1.777-.202-3.644-.889-3.644-3.954 0-.874.31-1.587.823-2.147-.083-.203-.357-1.017.078-2.12 0 0 .67-.215 2.197.82a7.68 7.68 0 0 1 2.004-.27c.68.003 1.367.092 2.004.27 1.527-1.035 2.197-.82 2.197-.82.435 1.103.161 1.917.078 2.12.513.56.823 1.273.823 2.147 0 3.073-1.87 3.75-3.652 3.947.287.247.543.735.543 1.48 0 1.068-.01 1.932-.01 2.193 0 .214.146.462.55.384A8.008 8.008 0 0 0 16 8.004C16 3.582 12.42 0 8 0z"/>
      </svg>
    </a>

    {/* Medium */}
    <a
      href="https://medium.com/secshubhamsharma"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Medium"
      className="text-black dark:text-white hover:text-primary-500 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 1043.63 592.71">
        <path d="M588.67 296.35c0 163.67-131.27 296.36-293.9 296.36C131.14 592.71 0 459.94 0 296.35 0 132.78 131.27 0 294.77 0c162.63 0 293.9 132.78 293.9 296.35zm318.95 0c0 154.55-65.51 279.85-146.34 279.85-80.65 0-146.2-125.3-146.2-279.85S680.63 16.5 761.28 16.5c80.83 0 146.34 125.3 146.34 279.85zM1043.63 296.35c0 139.73-23.29 253.13-51.93 253.13-28.58 0-51.93-113.4-51.93-253.13S963.12 43.22 991.7 43.22c28.64 0 51.93 113.41 51.93 253.13z"/>
      </svg>
    </a>
  </div>
</footer>


      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
}

export default App;
