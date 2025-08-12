import React, { useState, useEffect } from 'react';
import { Card, Button, Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard, Sun, Moon, ChevronLeft, ChevronRight, Download } from 'lucide-react';
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
    toast.success(`Copied: ${email}`);
  }

  function handleCopyAll() {
    if (results.length === 0) {
      toast.error("No emails to copy!");
      return;
    }
    const allEmails = results.join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(allEmails)
        .then(() => toast.success(`Copied ${results.length} emails!`))
        .catch(() => toast.error("Failed to copy all emails."));
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = allEmails;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        toast.success(`Copied ${results.length} emails!`);
      } catch (err) {
        console.error("Fallback: Failed to copy all emails.", err);
        toast.error("Failed to copy all emails.");
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }

  const downloadFile = (data, filename, type) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsTxt = () => {
    if (results.length === 0) {
      toast.error("No emails to export!");
      return;
    }
    const data = results.join('\n');
    downloadFile(data, 'emails.txt', 'text/plain');
    toast.success("Exported as TXT!");
  };

  const exportAsCsv = () => {
    if (results.length === 0) {
      toast.error("No emails to export!");
      return;
    }
    const csvHeader = "Email\n";
    const data = csvHeader + results.map(email => `"${email}"`).join('\n');
    downloadFile(data, 'emails.csv', 'text/csv');
    toast.success("Exported as CSV!");
  };

  const exportAsXlsx = () => {
    if (results.length === 0) {
      toast.error("No emails to export!");
      return;
    }
    if (typeof XLSX === 'undefined') {
      toast.error("Excel export library not loaded. Please try again.");
      console.error("XLSX library (SheetJS) is not loaded.");
      return;
    }

    const dataForSheet = results.map(email => ({ Email: email }));

    const ws = XLSX.utils.json_to_sheet(dataForSheet);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Emails");

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    downloadFile(s2ab(wbout), 'emails.xlsx', 'application/octet-stream');
    toast.success("Exported as XLSX!");
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${theme === 'dark' ? 'bg-dark_background text-dark_text' : 'bg-light_background text-light_text'} transition-colors duration-300 font-inter`}>
      <div className="max-w-6xl mx-auto py-8">
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

        <GeneratorForm onResults={(newResults) => {
          setResults(newResults);
          setCurrentPage(1);
        }} />

        {results.length > 0 && (
          <Card className={`mt-8 p-6 shadow-lg rounded-xl ${theme === 'dark' ? 'bg-dark_card text-dark_text' : 'bg-light_card text-light_text'}`}>
            <h3 className="text-xl font-bold mb-4">Generated Emails ({results.length})</h3>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              {/* Buttons group for Copy All and Export As */}
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  color="primary"
                  onClick={handleCopyAll}
                  startContent={<Clipboard size={16} />}
                  className="w-full sm:w-auto font-semibold"
                >
                  Copy All ({results.length})
                </Button>

                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button
                      color="primary"
                      variant="solid"
                      startContent={<Download size={16} />}
                      className="w-full sm:w-auto font-semibold"
                    >
                      Export As
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Export options"
                    onAction={(key) => {
                      if (key === "txt") {
                        exportAsTxt();
                      } else if (key === "csv") {
                        exportAsCsv();
                      } else if (key === "xlsx") {
                        exportAsXlsx();
                      }
                    }}
                  >
                    <DropdownItem key="txt">TXT (.txt)</DropdownItem>
                    <DropdownItem key="csv">CSV (.csv)</DropdownItem>
                    <DropdownItem key="xlsx">Excel (.xlsx)</DropdownItem> {/* Updated display text */}
                  </DropdownMenu>
                </Dropdown>
              </div>


              {totalPages > 1 && (
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
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
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
}

export default App;
