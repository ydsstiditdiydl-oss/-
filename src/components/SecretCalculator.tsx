import React, { useState, useEffect, useCallback } from 'react';
import { Delete } from 'lucide-react';

interface SecretCalculatorProps {
  onUnlock: () => void;
}

// Convert Eastern Arabic / Persian numerals to Western digits (e.g. ٩/١١/٢٠١٠ -> 9/11/2010)
const normalizeNumerals = (str: string): string => {
  return str
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
};

// Check if expression or display matches secret password
const isSecretPassword = (rawExpression: string, rawDisplay: string): boolean => {
  const normExpr = normalizeNumerals(rawExpression || '')
    .replace(/\s+/g, '')
    .replace(/÷/g, '/')
    .replace(/\\/g, '/');

  const normDisplay = normalizeNumerals(rawDisplay || '')
    .replace(/\s+/g, '')
    .replace(/÷/g, '/')
    .replace(/\\/g, '/');

  const validPasswords = [
    '9/11/2010',
    '09/11/2010',
    '9/11/10',
    '09/11/10',
    '2010/11/9',
    '2010/11/09'
  ];

  if (validPasswords.includes(normExpr) || validPasswords.includes(normDisplay)) {
    return true;
  }

  // Also check if sequence contains 9/11/2010
  if (normExpr === '9/11/2010' || normExpr.endsWith('9/11/2010')) {
    return true;
  }

  return false;
};

export const SecretCalculator: React.FC<SecretCalculatorProps> = ({ onUnlock }) => {
  const [expression, setExpression] = useState<string>('');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [isEnteringNewNumber, setIsEnteringNewNumber] = useState<boolean>(false);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);

  const handleDigit = useCallback((digit: string) => {
    if (hasEvaluated) {
      setDisplayValue(digit);
      setExpression(digit);
      setHasEvaluated(false);
      setIsEnteringNewNumber(false);
      return;
    }

    if (isEnteringNewNumber) {
      setDisplayValue(digit === '.' ? '0.' : digit);
      setIsEnteringNewNumber(false);
    } else {
      if (displayValue === '0' && digit !== '.') {
        setDisplayValue(digit);
      } else {
        if (digit === '.' && displayValue.includes('.')) return;
        setDisplayValue(prev => prev + digit);
      }
    }

    // Append to expression formula
    setExpression(prev => {
      if (!prev || prev === '0') {
        return digit === '.' ? '0.' : digit;
      }
      return prev + digit;
    });
  }, [hasEvaluated, isEnteringNewNumber, displayValue]);

  const handleOperator = useCallback((op: string) => {
    setHasEvaluated(false);
    setIsEnteringNewNumber(true);

    const formattedOp = ` ${op} `;

    if (!expression) {
      setExpression(`${displayValue === '0' ? '0' : displayValue}${formattedOp}`);
      return;
    }

    // If expression already ends with an operator (ignoring spaces), replace it
    const trimmed = expression.trim();
    const lastChar = trimmed.slice(-1);
    if (['+', '-', '×', '÷', '*', '/'].includes(lastChar)) {
      // Find the last operator and replace it
      const base = trimmed.slice(0, -1).trimEnd();
      setExpression(`${base}${formattedOp}`);
    } else {
      setExpression(prev => `${prev.trimEnd()}${formattedOp}`);
    }
  }, [expression, displayValue]);

  const handleClear = useCallback(() => {
    setDisplayValue('0');
    setExpression('');
    setIsEnteringNewNumber(false);
    setHasEvaluated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (expression.length > 0) {
      const trimmed = expression.trimEnd();
      // If ends with an operator like ' ÷', remove the operator
      if (trimmed.endsWith('÷') || trimmed.endsWith('×') || trimmed.endsWith('+') || trimmed.endsWith('-')) {
        setExpression(trimmed.slice(0, -1).trimEnd());
      } else {
        setExpression(prev => (prev.length > 1 ? prev.slice(0, -1) : ''));
      }

      if (displayValue.length > 1) {
        setDisplayValue(prev => prev.slice(0, -1));
      } else {
        setDisplayValue('0');
      }
    } else {
      setDisplayValue('0');
      setExpression('');
    }
  }, [expression, displayValue]);

  const handleToggleSign = useCallback(() => {
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      const toggled = (-val).toString();
      setDisplayValue(toggled);
    }
  }, [displayValue]);

  const handlePercent = useCallback(() => {
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      const pct = (val / 100).toString();
      setDisplayValue(pct);
      setExpression(prev => `${prev} %`);
    }
  }, [displayValue]);

  const handleEqual = useCallback(() => {
    // 1. Check secret password logic: "9 ÷ 11 ÷ 2010" is recognized as "9/11/2010"
    if (isSecretPassword(expression, displayValue)) {
      onUnlock();
      return;
    }

    // 2. Normal mathematical evaluation
    try {
      const sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100');

      if (!sanitized.trim()) return;

      // Safe evaluation of standard arithmetic expression
      const result = Function(`'use strict'; return (${sanitized})`)();
      if (result === undefined || isNaN(result)) {
        setDisplayValue('Error');
      } else {
        const formatted = Number.isFinite(result)
          ? String(parseFloat(result.toFixed(8)))
          : 'Error';
        setDisplayValue(formatted);
        setExpression(formatted);
      }
      setHasEvaluated(true);
      setIsEnteringNewNumber(true);
    } catch {
      setDisplayValue('Error');
      setHasEvaluated(true);
      setIsEnteringNewNumber(true);
    }
  }, [expression, displayValue, onUnlock]);

  // Support physical and virtual keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        handleDigit(key);
      } else if (key === '.') {
        e.preventDefault();
        handleDigit('.');
      } else if (key === '/' || key === '÷') {
        e.preventDefault();
        handleOperator('÷');
      } else if (key === '*' || key === 'x' || key === 'X' || key === '×') {
        e.preventDefault();
        handleOperator('×');
      } else if (key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (key === '=' || key === 'Enter') {
        e.preventDefault();
        handleEqual();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        handleClear();
      } else if (key === '%') {
        e.preventDefault();
        handlePercent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEqual, handleBackspace, handleClear, handlePercent]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 select-none" dir="ltr">
      <div className="w-full max-w-[360px] bg-neutral-950 p-6 rounded-[2.5rem] border border-neutral-900 shadow-2xl flex flex-col justify-between">
        {/* Screen Header indicator bar */}
        <div className="w-16 h-1 bg-neutral-800 rounded-full mx-auto mb-6 opacity-60" />

        {/* Display Area */}
        <div className="mb-6 px-2 text-right flex flex-col justify-end min-h-[110px]">
          <div className="text-neutral-500 text-sm h-6 overflow-hidden tracking-wider font-mono">
            {expression || ' '}
          </div>
          <div className="text-white text-5xl font-light tracking-tight truncate font-mono mt-1">
            {displayValue}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-3 text-2xl font-normal">
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className="h-16 rounded-full bg-neutral-700 text-white active:bg-neutral-600 transition-colors flex items-center justify-center font-medium"
          >
            {displayValue !== '0' || expression !== '' ? 'C' : 'AC'}
          </button>
          <button
            onClick={handleToggleSign}
            className="h-16 rounded-full bg-neutral-700 text-white active:bg-neutral-600 transition-colors flex items-center justify-center"
          >
            ±
          </button>
          <button
            onClick={handlePercent}
            className="h-16 rounded-full bg-neutral-700 text-white active:bg-neutral-600 transition-colors flex items-center justify-center"
          >
            %
          </button>
          <button
            onClick={() => handleOperator('÷')}
            className="h-16 rounded-full bg-amber-500 text-white active:bg-amber-400 transition-colors flex items-center justify-center text-3xl font-light"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleDigit('7')}
            className="h-16 rounded-full bg-neutral-800 text-white active:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            7
          </button>
          <button
            onClick={() => handleDigit('8')}
            className="h-16 rounded-full bg-neutral-800 text-white active:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            8
          </button>
          <button
            onClick={() => handleDigit('9')}
            className="h-16 rounded-full bg-neutral-800 text-white active:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            9
          </button>
          <button
            onClick={() => handleOperator('×')}
            className="h-16 rounded-full bg-amber-500 text-white active:bg-amber-400 transition-colors flex items-center justify-center text-3xl font-light"
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleDigit('4')}
            className="h-16 rounded-full bg-neutral-800 text-white active:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            4
          </button>
          <button
            onClick={() => handleDigit('5')}
            className="h-16 rounded-full bg-neutral-800 text-white active:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            5
          </button>
          <button
            onClick={() => handleDigit('6')}
            className="h-16 rounded-full bg-neutral-800 text-white active:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            6
          </button>
          <button
            onClick={() => handleOperator('-')}
            className="h-16 rounded-full bg-amber-500 text-white active:bg-amber-400 transition-colors flex items-center justify-center text-3xl font-light"
          >
            -
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleDigit('1')}
            className="h-16 rounded-full bg-neutral-800 text-white active:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            1
          </button>
          <button
            onClick={() => handleDigit('2')}
            className="h-16 rounded-full bg-neutral-800 text-white active:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            2
          </button>
          <button
            onClick={() => handleDigit('3')}
            className="h-16 rounded-full bg-neutral-800 text-white active:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            3
          </button>
          <button
            onClick={() => handleOperator('+')}
            className="h-16 rounded-full bg-amber-500 text-white active:bg-amber-400 transition-colors flex items-center justify-center text-3xl font-light"
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={() => handleDigit('0')}
            className="h-16 rounded-full bg-neutral-800 text-white active:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={() => handleDigit('.')}
            className="h-16 rounded-full bg-neutral-800 text-white active:bg-neutral-700 transition-colors flex items-center justify-center font-bold"
          >
            .
          </button>
          <button
            onClick={handleBackspace}
            aria-label="Delete"
            className="h-16 rounded-full bg-neutral-800 text-neutral-300 active:bg-neutral-700 transition-colors flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={handleEqual}
            className="h-16 rounded-full bg-amber-500 text-white active:bg-amber-400 transition-colors flex items-center justify-center text-3xl font-medium shadow-lg shadow-amber-500/20"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
