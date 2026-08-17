import React from 'react';
import CodeBlock from './CodeBlock';

interface BlogContentProps {
  content: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  const formatContent = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentCodeBlock = '';
    let currentLanguage = '';
    let inCodeBlock = false;
    let codeBlockIndex = 0;

    // Si el texto no tiene formato markdown, aplicar formato básico
    const hasMarkdownFormatting = lines.some(line => 
      line.startsWith('#') || 
      line.startsWith('```') || 
      line.startsWith('- ') || 
      line.startsWith('* ') || 
      line.startsWith('> ') ||
      /^\d+\.\s/.test(line)
    );

    if (!hasMarkdownFormatting) {
      // Formatear texto plano con párrafos
      const paragraphs = text.split('\n\n').filter(p => p.trim());
      return paragraphs.map((paragraph, index) => (
        <p key={`p-${index}`} style={{
          color: '#E0E0E0',
          lineHeight: '1.6',
          margin: '1rem 0',
          fontSize: '1rem',
          textAlign: 'justify'
        }}>
          {formatInlineText(paragraph)}
        </p>
      ));
    }

    lines.forEach((line, index) => {
      // Detectar inicio de bloque de código
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          // Inicio de bloque de código
          inCodeBlock = true;
          currentLanguage = line.trim().slice(3).trim() || 'text';
          currentCodeBlock = '';
        } else {
          // Fin de bloque de código
          inCodeBlock = false;
          elements.push(
            <CodeBlock
              key={`code-${codeBlockIndex}`}
              code={currentCodeBlock.trim()}
              language={currentLanguage}
              showLineNumbers={true}
            />
          );
          codeBlockIndex++;
          currentCodeBlock = '';
          currentLanguage = '';
        }
        return;
      }

      // Si estamos en un bloque de código, agregar a currentCodeBlock
      if (inCodeBlock) {
        currentCodeBlock += line + '\n';
        return;
      }

      // Procesar líneas normales
      if (line.trim() === '') {
        elements.push(<br key={`br-${index}`} />);
        return;
      }

      // Títulos
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${index}`} style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#D4AF37',
            margin: '2rem 0 1rem 0',
            fontFamily: "'Chakra Petch', sans-serif"
          }}>
            {line.slice(2)}
          </h1>
        );
        return;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${index}`} style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#D4AF37',
            margin: '1.5rem 0 0.8rem 0',
            fontFamily: "'Chakra Petch', sans-serif"
          }}>
            {line.slice(3)}
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${index}`} style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#E0E0E0',
            margin: '1.2rem 0 0.6rem 0'
          }}>
            {line.slice(4)}
          </h3>
        );
        return;
      }

      // Listas
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <div key={`li-${index}`} style={{
            margin: '0.5rem 0',
            paddingLeft: '1.5rem',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              left: '0',
              color: '#D4AF37',
              fontWeight: 'bold'
            }}>•</span>
            <span style={{ color: '#E0E0E0' }}>
              {formatInlineText(line.slice(2))}
            </span>
          </div>
        );
        return;
      }

      if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.+)/);
        if (match) {
          elements.push(
            <div key={`ol-${index}`} style={{
              margin: '0.5rem 0',
              paddingLeft: '1.5rem',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                color: '#D4AF37',
                fontWeight: 'bold'
              }}>{match[1]}.</span>
              <span style={{ color: '#E0E0E0' }}>
                {formatInlineText(match[2])}
              </span>
            </div>
          );
          return;
        }
      }

      // Citas
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={`quote-${index}`} style={{
            borderLeft: '4px solid #D4AF37',
            paddingLeft: '1rem',
            margin: '1rem 0',
            fontStyle: 'italic',
            color: '#B0B0B0',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            {formatInlineText(line.slice(2))}
          </blockquote>
        );
        return;
      }

      // Párrafos normales
      if (line.trim()) {
        elements.push(
          <p key={`p-${index}`} style={{
            color: '#E0E0E0',
            lineHeight: '1.6',
            margin: '1rem 0',
            fontSize: '1rem'
          }}>
            {formatInlineText(line)}
          </p>
        );
      }
    });

    return elements;
  };

  const formatInlineText = (text: string): React.ReactNode => {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #D4AF37; font-weight: bold;">$1</strong>');
    
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>');
    
    // Code inline
    text = text.replace(/`(.*?)`/g, '<code style="background-color: #2d2d2d; color: #4ecdc4; padding: 2px 6px; border-radius: 4px; font-family: Monaco, monospace; font-size: 0.9em;">$1</code>');
    
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #4ecdc4; text-decoration: none; border-bottom: 1px solid #4ecdc4;">$1</a>');
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div style={{
      maxWidth: '100%',
      margin: '0',
      padding: '0',
      lineHeight: '1.6',
      backgroundColor: 'transparent'
    }}>
      {formatContent(content)}
    </div>
  );
};

export default BlogContent;
