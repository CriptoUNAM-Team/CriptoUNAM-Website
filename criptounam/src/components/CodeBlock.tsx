import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { escapeHtml } from '../utils/html';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language = 'javascript', 
  title,
  showLineNumbers = true,
  maxHeight = '400px'
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const getLanguageColor = (lang: string): string => {
    const colors: { [key: string]: string } = {
      solidity: '#363636',
      javascript: '#f7df1e',
      typescript: '#3178c6',
      python: '#3776ab',
      rust: '#dea584',
      html: '#e34f26',
      css: '#1572b6',
      json: '#000000',
      bash: '#4eaa25',
      default: '#6b7280'
    };
    return colors[lang.toLowerCase()] || colors.default;
  };

  const getLanguageIcon = (lang: string): string => {
    const icons: { [key: string]: string } = {
      solidity: '🔷',
      javascript: '🟨',
      typescript: '🔵',
      python: '🐍',
      rust: '🦀',
      html: '🌐',
      css: '🎨',
      json: '📄',
      bash: '💻',
      default: '📝'
    };
    return icons[lang.toLowerCase()] || icons.default;
  };

  const formatCode = (codeRaw: string): string => {
    // El resultado se inyecta con dangerouslySetInnerHTML: hay que escapar
    // antes de colorear. Además arregla los ejemplos con etiquetas (`<div>`),
    // que hasta ahora el navegador interpretaba en vez de mostrarlos.
    const code = escapeHtml(codeRaw)
    // Aplicar formato básico según el lenguaje
    switch (language.toLowerCase()) {
      case 'solidity':
        return code
          .replace(/\b(contract|function|modifier|event|struct|enum|mapping|public|private|internal|external|view|pure|payable|returns|if|else|for|while|do|break|continue|return|require|assert|revert)\b/g, '<span style="color: #ff6b6b; font-weight: bold;">$1</span>')
          .replace(/\b(uint|int|bool|string|address|bytes|mapping)\b/g, '<span style="color: #4ecdc4; font-weight: bold;">$1</span>')
          .replace(/\b(msg\.sender|msg\.value|block\.timestamp|block\.number|tx\.origin)\b/g, '<span style="color: #45b7d1; font-weight: bold;">$1</span>')
          .replace(/(\/\/.*$)/gm, '<span style="color: #6c757d; font-style: italic;">$1</span>')
          .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6c757d; font-style: italic;">$1</span>');
      
      case 'javascript':
      case 'typescript':
        return code
          .replace(/\b(const|let|var|function|class|interface|type|enum|import|export|from|default|async|await|return|if|else|for|while|do|break|continue|switch|case|try|catch|finally|throw|new|this|super|extends|implements)\b/g, '<span style="color: #ff6b6b; font-weight: bold;">$1</span>')
          .replace(/\b(true|false|null|undefined)\b/g, '<span style="color: #4ecdc4; font-weight: bold;">$1</span>')
          .replace(/(\/\/.*$)/gm, '<span style="color: #6c757d; font-style: italic;">$1</span>')
          .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6c757d; font-style: italic;">$1</span>');
      
      case 'python':
        return code
          .replace(/\b(def|class|if|elif|else|for|while|try|except|finally|with|import|from|return|yield|lambda|and|or|not|in|is|as|pass|break|continue|raise|assert|global|nonlocal)\b/g, '<span style="color: #ff6b6b; font-weight: bold;">$1</span>')
          .replace(/\b(True|False|None)\b/g, '<span style="color: #4ecdc4; font-weight: bold;">$1</span>')
          .replace(/(#.*$)/gm, '<span style="color: #6c757d; font-style: italic;">$1</span>');
      
      default:
        return code;
    }
  };

  const lines = code.split('\n');
  const lineNumbers = showLineNumbers ? lines.map((_, i) => i + 1) : [];

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      border: '1px solid #333',
      overflow: 'hidden',
      margin: '16px 0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2d2d2d',
        padding: '12px 16px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{getLanguageIcon(language)}</span>
          <span style={{ 
            color: '#fff', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {title || `${language.toUpperCase()} Code`}
          </span>
          <span style={{
            backgroundColor: getLanguageColor(language),
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {language.toUpperCase()}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          style={{
            backgroundColor: copied ? '#4caf50' : '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = copied ? '#4caf50' : '#555';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = copied ? '#4caf50' : '#444';
          }}
        >
          <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>

      {/* Code Content */}
      <div style={{
        maxHeight,
        overflow: 'auto',
        backgroundColor: '#1a1a1a',
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <div style={{ display: 'flex' }}>
          {/* Line Numbers */}
          {showLineNumbers && (
            <div style={{
              backgroundColor: '#2d2d2d',
              color: '#666',
              padding: '16px 8px 16px 16px',
              borderRight: '1px solid #333',
              userSelect: 'none',
              minWidth: '50px',
              textAlign: 'right'
            }}>
              {lineNumbers.map((num) => (
                <div key={num} style={{ height: '21px', lineHeight: '21px' }}>
                  {num}
                </div>
              ))}
            </div>
          )}
          
          {/* Code */}
          <div style={{
            flex: 1,
            padding: '16px',
            color: '#e0e0e0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            <div dangerouslySetInnerHTML={{ __html: formatCode(code) }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
