import { useMemo } from 'react';
import katex from 'katex';

const HTML_ALLOWED_TAGS = ['span', 'div', 'details', 'summary', 'a', 'b', 'i', 'strong', 'em', 'code', 'pre', 'br', 'hr', 'sup', 'sub'];

const EMOJI_MAP: Record<string, string> = {
  ':smile:': '😄', ':laughing:': '😆', ':blush:': '😊', ':heart:': '❤️',
  ':thumbsup:': '👍', ':thumbsdown:': '👎', ':clap:': '👏', ':fire:': '🔥',
  ':rocket:': '🚀', ':star:': '⭐', ':check:': '✅', ':x:': '❌',
  ':warning:': '⚠️', ':info:': 'ℹ️', ':question:': '❓', ':bulb:': '💡',
  ':tada:': '🎉', ':bug:': '🐛', ':wrench:': '🔧', ':lock:': '🔒',
};

function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  const walk = (node: ChildNode) => {
    if (node.nodeType === 1) {
      const el = node as HTMLElement;
      if (!HTML_ALLOWED_TAGS.includes(el.tagName.toLowerCase())) {
        el.replaceWith(document.createTextNode(el.textContent || ''));
        return;
      }
      Array.from(el.attributes).forEach(attr => {
        const name = attr.name.toLowerCase();
        if (name === 'href' && el.tagName.toLowerCase() === 'a') return;
        if (name === 'style' || name === 'align' || name === 'class') return;
        if (name.startsWith('on')) { el.removeAttribute(name); return; }
        el.removeAttribute(name);
      });
      el.childNodes.forEach(walk);
    }
  };
  div.childNodes.forEach(walk);
  return div.innerHTML;
}

interface MarkdownRendererProps {
  text: string;
}

function parseMathBlocks(text: string): Array<{ type: 'text' | 'math-block'; content: string }> {
  const parts: Array<{ type: 'text' | 'math-block'; content: string }> = [];
  const regex = /\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: 'text', content: text.slice(last, match.index) });
    parts.push({ type: 'math-block', content: match[1] || match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) });
  return parts;
}

function renderInline(text: string): React.ReactNode {
  let result: React.ReactNode[] = [text];
  const patterns: Array<{ regex: RegExp; render: (match: RegExpExecArray) => React.ReactNode }> = [
    {
      regex: /!\[([^\]]*)\]\(([^)]+)\)/g,
      render: (m) => <img src={m[2]} alt={m[1]} className="max-w-full rounded-lg my-1" key={m.index} />,
    },
    {
      regex: /\[([^\]]+)\]\(([^)]+)\)/g,
      render: (m) => <a href={m[2]} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline" key={m.index}>{m[1]}</a>,
    },
    { regex: /\*\*(.+?)\*\*/g, render: (m) => <strong key={m.index}>{m[1]}</strong> },
    { regex: /\*(.+?)\*/g, render: (m) => <em key={m.index}>{m[1]}</em> },
    { regex: /~~(.+?)~~/g, render: (m) => <span className="line-through" key={m.index}>{m[1]}</span> },
    { regex: /`([^`]+)`/g, render: (m) => <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-[12px] font-mono" key={m.index}>{m[1]}</code> },
    {
      regex: /\\\(([\s\S]*?)\\\)/g,
      render: (m) => {
        try {
          const html = katex.renderToString(m[1], { throwOnError: false, displayMode: false });
          return <span key={m.index} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch { return <span key={m.index} className="text-red-400">{m[0]}</span>; }
      },
    },
    {
      regex: /\$([^$]+)\$/g,
      render: (m) => {
        try {
          const html = katex.renderToString(m[1], { throwOnError: false, displayMode: false });
          return <span key={m.index} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch { return <span key={m.index} className="text-red-400">{m[0]}</span>; }
      },
    },
  ];

  patterns.forEach(({ regex, render }) => {
    const newResult: React.ReactNode[] = [];
    result.forEach(node => {
      if (typeof node !== 'string') { newResult.push(node); return; }
      const str = node as string;
      let last = 0;
      let match: RegExpExecArray | null;
      const localRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
      while ((match = localRegex.exec(str)) !== null) {
        if (match.index > last) newResult.push(str.slice(last, match.index));
        newResult.push(render(match));
        last = match.index + match[0].length;
      }
      if (last < str.length) newResult.push(str.slice(last));
      else if (last === 0 && newResult.length === 0) newResult.push(str);
    });
    result = newResult;
  });

  Object.entries(EMOJI_MAP).forEach(([shortcode, emoji]) => {
    const newResult: React.ReactNode[] = [];
    result.forEach(node => {
      if (typeof node !== 'string') { newResult.push(node); return; }
      const parts = (node as string).split(shortcode);
      parts.forEach((part, i) => {
        if (i > 0) newResult.push(emoji);
        newResult.push(part);
      });
    });
    result = newResult;
  });

  return result.filter(n => n !== '').map((n, i) =>
    typeof n === 'string' ? <span key={i}>{n}</span> : n
  );
}

function renderBlock(block: string, idx: string): React.ReactNode {
  if (block.trim().startsWith('<') && block.trim().endsWith('>')) {
    const sanitized = sanitizeHtml(block.trim());
    return <div key={idx} dangerouslySetInnerHTML={{ __html: sanitized }} />;
  }

  if (block.startsWith('```')) {
    const langEnd = block.indexOf('\n');
    const lang = langEnd > 3 ? block.slice(3, langEnd).trim() : '';
    const code = langEnd > -1 ? block.slice(langEnd + 1).replace(/```$/, '') : block.slice(3).replace(/```$/, '');
    return (
      <div key={idx} className="my-2 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
        {lang && <div className="bg-black/5 dark:bg-white/5 px-3 py-1.5 text-[10px] font-mono text-gray-500 dark:text-gray-400">{lang}</div>}
        <pre className="bg-black/[0.03] dark:bg-white/[0.03] p-3 overflow-x-auto hide-scrollbar"><code className="text-[12px] font-mono text-gray-800 dark:text-gray-200 whitespace-pre">{code}</code></pre>
      </div>
    );
  }

  if (/^#{1,6}\s/.test(block)) {
    const level = block.match(/^(#{1,6})/)![1].length;
    const text = block.replace(/^#{1,6}\s/, '');
    const sizes = ['text-lg', 'text-base', 'text-sm', 'text-[13px]', 'text-[12px]', 'text-[11px]'];
    return <div key={idx} className={`font-bold ${sizes[level - 1]} mt-3 mb-1 text-gray-900 dark:text-gray-100`}>{renderInline(text)}</div>;
  }

  if (/^---+\s*$/.test(block)) {
    return <hr key={idx} className="my-3 border-gray-300 dark:border-white/20" />;
  }

  if (/^>\s*\[!(WARNING|NOTE|INFO|TIP|DANGER|IMPORTANT)\]/i.test(block)) {
    const match = block.match(/^>\s*\[!(WARNING|NOTE|INFO|TIP|DANGER|IMPORTANT)\](.*)/i)!;
    const type = match[1].toUpperCase();
    const content = match[2].replace(/^>\s?/gm, '');
    const colors: Record<string, string> = {
      WARNING: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10',
      NOTE: 'border-blue-500 bg-blue-50 dark:bg-blue-500/10',
      INFO: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10',
      TIP: 'border-green-500 bg-green-50 dark:bg-green-500/10',
      DANGER: 'border-red-500 bg-red-50 dark:bg-red-500/10',
      IMPORTANT: 'border-purple-500 bg-purple-50 dark:bg-purple-500/10',
    };
    return (
      <div key={idx} className={`border-l-4 ${colors[type] || colors.NOTE} rounded-r-lg px-3 py-2 my-2`}>
        <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">{type}</div>
        <div className="text-[12px] text-gray-600 dark:text-gray-400">{renderInline(content.trim())}</div>
      </div>
    );
  }

  if (/^>\s/.test(block)) {
    const content = block.replace(/^>\s?/gm, '');
    return (
      <div key={idx} className="border-l-4 border-gray-300 dark:border-white/30 pl-3 py-1 my-2 text-[12px] text-gray-600 dark:text-gray-400 italic">
        {renderInline(content)}
      </div>
    );
  }

  const tableRows = block.split('\n').filter(r => /^\|.+\|$/.test(r.trim()));
  if (tableRows.length >= 2) {
    const preambleLines = block.split('\n').filter(r => !/^\|.+\|$/.test(r.trim())).join('\n').trim();
    const isHeaderSep = /^\|[\s\-:|]+\|$/.test(tableRows[1]);
    const dataRows = isHeaderSep ? tableRows.slice(2) : tableRows.slice(1);
    const headers = tableRows[0].split('|').filter(c => c.trim()).map(c => c.trim());
    return (
      <div key={idx}>
        {preambleLines && <p className="my-1 text-[13px] text-gray-800 dark:text-gray-200 leading-relaxed">{renderInline(preambleLines)}</p>}
        <div className="my-2 overflow-x-auto hide-scrollbar">
          <table className="w-full text-[12px] border-collapse border border-gray-300 dark:border-white/20">
            {isHeaderSep && (
              <thead>
                <tr className="bg-black/5 dark:bg-white/5">
                  {headers.map((h, i) => <th key={i} className="border border-gray-300 dark:border-white/20 px-3 py-1.5 text-left font-bold">{renderInline(h)}</th>)}
                </tr>
              </thead>
            )}
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri}>
                  {row.split('|').filter(c => c.trim()).map((c, ci) => (
                    <td key={ci} className="border border-gray-300 dark:border-white/20 px-3 py-1.5">{renderInline(c.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (/^\s*\[(\s|x)\]\s/.test(block)) {
    const checked = block.match(/^\s*\[(x)\]/);
    return (
      <div key={idx} className="flex items-start gap-2 my-0.5 text-[12px] text-gray-800 dark:text-gray-200">
        <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${checked ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-400 dark:border-gray-500'}`}>
          {checked ? '✓' : ''}
        </span>
        <span>{renderInline(block.replace(/^\s*\[[ x]\]\s*/, ''))}</span>
      </div>
    );
  }

  if (/^\d+\.\s/.test(block)) {
    const num = block.match(/^(\d+)\./)![1];
    return (
      <div key={idx} className="flex items-start gap-2 my-0.5 text-[12px] text-gray-800 dark:text-gray-200">
        <span className="w-5 text-right shrink-0 font-mono text-gray-400">{num}.</span>
        <span>{renderInline(block.replace(/^\d+\.\s*/, ''))}</span>
      </div>
    );
  }

  if (/^[-*]\s/.test(block)) {
    return (
      <div key={idx} className="flex items-start gap-2 my-0.5 text-[12px] text-gray-800 dark:text-gray-200">
        <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0 opacity-50"></span>
        <span>{renderInline(block.replace(/^[-*]\s*/, ''))}</span>
      </div>
    );
  }

  return <p key={idx} className="my-1 text-[13px] text-gray-800 dark:text-gray-200 leading-relaxed">{renderInline(block)}</p>;
}

export default function MarkdownRenderer({ text }: MarkdownRendererProps) {
  const rendered = useMemo(() => {
    const mathParts = parseMathBlocks(text);
    return mathParts.map((part, i) => {
      if (part.type === 'math-block') {
        try {
          const html = katex.renderToString(part.content, { throwOnError: false, displayMode: true });
          return <div key={i} className="my-3 overflow-x-auto hide-scrollbar" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <div key={i} className="my-2 p-2 bg-red-500/10 rounded text-red-500 text-[12px] font-mono">{part.content}</div>;
        }
      }
      const blocks = part.content.split('\n\n');
      return (
        <div key={i}>
          {blocks.filter(b => b.trim()).map((block, j) => renderBlock(block, `${i}-${j}`))}
        </div>
      );
    });
  }, [text]);

  return <div className="space-y-0.5">{rendered}</div>;
}