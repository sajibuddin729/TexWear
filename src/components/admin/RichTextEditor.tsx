'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Table as TableIcon,
  Plus,
  Trash2,
  Undo,
  Redo,
  RemoveFormatting,
  Code,
  Eye,
  Type,
  Palette,
  Highlighter,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write product description, details, size chart, or specifications here...',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlCode, setHtmlCode] = useState(value || '');
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState('14px');
  const [selectedBlock, setSelectedBlock] = useState('p');

  // Synchronize incoming value into editor innerHTML without losing cursor when user types
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
        setHtmlCode(value || '');
      }
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const newHtml = editorRef.current.innerHTML;
      setHtmlCode(newHtml);
      onChange(newHtml);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [onChange]);

  // Execute standard formatting commands
  const exec = (command: string, val: string | undefined = undefined) => {
    if (isHtmlMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleInput();
  };

  // Change font size
  const handleFontSizeChange = (size: string) => {
    setSelectedFontSize(size);
    if (isHtmlMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Use span with font-size for precise CSS sizing
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      // If no text selected, format block
      return;
    }

    const selectedText = range.extractContents();
    const span = document.createElement('span');
    span.style.fontSize = size;
    span.appendChild(selectedText);
    range.insertNode(span);

    // Reselect
    range.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(range);
    handleInput();
  };

  // Change heading/block format
  const handleBlockChange = (blockTag: string) => {
    setSelectedBlock(blockTag);
    if (isHtmlMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('formatBlock', false, `<${blockTag}>`);
    handleInput();
  };

  // Insert HTML snippet at cursor position
  const insertHtmlAtCursor = (html: string) => {
    if (isHtmlMode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();

      const el = document.createElement('div');
      el.innerHTML = html;
      const frag = document.createDocumentFragment();
      let node: Node | null = null;
      let lastNode: Node | null = null;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else if (editorRef.current) {
      editorRef.current.innerHTML += html;
    }
    handleInput();
  };

  // Insert custom responsive table
  const handleInsertTable = (rows: number, cols: number) => {
    setShowTableMenu(false);

    let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 12px 0; border: 1px solid #475569; font-size: 13px;">`;
    tableHtml += `<thead><tr style="background-color: rgba(14, 165, 233, 0.15); border-bottom: 2px solid #0284c7;">`;

    for (let c = 1; c <= cols; c++) {
      tableHtml += `<th style="border: 1px solid #475569; padding: 8px 12px; text-align: left; font-weight: 800; color: #38bdf8;">Header ${c}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;

    for (let r = 1; r < rows; r++) {
      tableHtml += `<tr>`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td style="border: 1px solid #475569; padding: 8px 12px; color: #f1f5f9;">Data ${r}-${c}</td>`;
      }
      tableHtml += `</tr>`;
    }

    tableHtml += `</tbody></table><p><br></p>`;
    insertHtmlAtCursor(tableHtml);
  };

  // Quick Table Actions (Add row, delete row, etc.)
  const handleTableAction = (action: 'addRow' | 'addCol' | 'deleteRow' | 'deleteTable') => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let node = sel.anchorNode;
    let targetCell: HTMLTableCellElement | null = null;
    let targetRow: HTMLTableRowElement | null = null;
    let targetTable: HTMLTableElement | null = null;

    while (node && node !== editorRef.current) {
      if (node.nodeName === 'TD' || node.nodeName === 'TH') {
        targetCell = node as HTMLTableCellElement;
      }
      if (node.nodeName === 'TR') {
        targetRow = node as HTMLTableRowElement;
      }
      if (node.nodeName === 'TABLE') {
        targetTable = node as HTMLTableElement;
        break;
      }
      node = node.parentNode;
    }

    if (!targetTable) {
      // Fallback: If not inside table, insert standard 3x3 table
      handleInsertTable(3, 3);
      return;
    }

    if (action === 'deleteTable') {
      targetTable.remove();
      handleInput();
      return;
    }

    if (action === 'addRow') {
      const colCount = targetTable.rows[0]?.cells.length || 3;
      const newRow = targetTable.insertRow(targetRow ? targetRow.rowIndex + 1 : -1);
      for (let i = 0; i < colCount; i++) {
        const cell = newRow.insertCell(i);
        cell.style.border = '1px solid #475569';
        cell.style.padding = '8px 12px';
        cell.style.color = '#f1f5f9';
        cell.innerHTML = 'New Cell';
      }
      handleInput();
      return;
    }

    if (action === 'addCol') {
      for (let i = 0; i < targetTable.rows.length; i++) {
        const row = targetTable.rows[i];
        const isHeader = row.parentElement?.nodeName === 'THEAD' || i === 0;
        const cell = isHeader ? document.createElement('th') : document.createElement('td');
        cell.style.border = '1px solid #475569';
        cell.style.padding = '8px 12px';
        if (isHeader) {
          cell.style.fontWeight = 'bold';
          cell.style.color = '#38bdf8';
          cell.innerHTML = 'Col Header';
        } else {
          cell.style.color = '#f1f5f9';
          cell.innerHTML = 'Cell';
        }
        row.appendChild(cell);
      }
      handleInput();
      return;
    }

    if (action === 'deleteRow' && targetRow) {
      targetRow.remove();
      handleInput();
      return;
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlCode(val);
    onChange(val);
    if (editorRef.current) {
      editorRef.current.innerHTML = val;
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl text-slate-200">
      {/* Word-Style Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900 border-b border-slate-800 select-none">
        {/* Style / Heading Dropdown */}
        <select
          value={selectedBlock}
          onChange={(e) => handleBlockChange(e.target.value)}
          disabled={isHtmlMode}
          className="bg-slate-950 text-slate-200 text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer disabled:opacity-50"
          title="Text Style"
        >
          <option value="p">Normal Text</option>
          <option value="h1">Heading 1 (Main)</option>
          <option value="h2">Heading 2 (Sub)</option>
          <option value="h3">Heading 3 (Section)</option>
          <option value="blockquote">Quote / Highlight</option>
        </select>

        {/* Font Size Dropdown */}
        <select
          value={selectedFontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
          disabled={isHtmlMode}
          className="bg-slate-950 text-slate-200 text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer disabled:opacity-50"
          title="Font Size"
        >
          <option value="11px">11px (Tiny)</option>
          <option value="12px">12px (Small)</option>
          <option value="14px">14px (Standard)</option>
          <option value="16px">16px (Medium)</option>
          <option value="18px">18px (Large)</option>
          <option value="20px">20px (X-Large)</option>
          <option value="24px">24px (Huge)</option>
        </select>

        <div className="h-5 w-[1px] bg-slate-800 mx-1" />

        {/* Bold, Italic, Underline, Strikethrough */}
        <button
          type="button"
          onClick={() => exec('bold')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4 font-black" />
        </button>

        <button
          type="button"
          onClick={() => exec('italic')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => exec('underline')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => exec('strikeThrough')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-800 mx-1" />

        {/* Text Color Picker */}
        <label
          className="relative p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          title="Text Color"
        >
          <Palette className="w-4 h-4 text-sky-400" />
          <input
            type="color"
            defaultValue="#ffffff"
            onChange={(e) => exec('foreColor', e.target.value)}
            disabled={isHtmlMode}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
          />
        </label>

        {/* Highlight Color Picker */}
        <label
          className="relative p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          title="Highlight Background Color"
        >
          <Highlighter className="w-4 h-4 text-amber-400" />
          <input
            type="color"
            defaultValue="#0284c7"
            onChange={(e) => exec('hiliteColor', e.target.value)}
            disabled={isHtmlMode}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
          />
        </label>

        <div className="h-5 w-[1px] bg-slate-800 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => exec('justifyLeft')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => exec('justifyCenter')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => exec('justifyRight')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => exec('justifyFull')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-800 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-800 mx-1" />

        {/* Table Management */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTableMenu(!showTableMenu)}
            disabled={isHtmlMode}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
              showTableMenu
                ? 'bg-sky-600 text-white'
                : 'hover:bg-slate-800 text-sky-400 hover:text-sky-300'
            } disabled:opacity-50`}
            title="Table Tools"
          >
            <TableIcon className="w-4 h-4" />
            <span>Table</span>
          </button>

          {showTableMenu && (
            <div className="absolute top-full left-0 mt-2 z-50 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 space-y-1 text-xs">
              <div className="font-extrabold text-[11px] text-slate-400 px-2 py-1 uppercase tracking-wider">
                Insert Table
              </div>
              <button
                type="button"
                onClick={() => handleInsertTable(3, 3)}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold"
              >
                📊 3 × 3 Size / Spec Table
              </button>
              <button
                type="button"
                onClick={() => handleInsertTable(2, 2)}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold"
              >
                📊 2 × 2 Simple Table
              </button>
              <button
                type="button"
                onClick={() => handleInsertTable(4, 4)}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold"
              >
                📊 4 × 4 Detailed Table
              </button>

              <div className="border-t border-slate-800 my-1 pt-1">
                <div className="font-extrabold text-[11px] text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Edit Existing Table
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleTableAction('addRow');
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-sky-300 font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> + Add Row
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleTableAction('addCol');
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-sky-300 font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> + Add Column
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleTableAction('deleteRow');
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-rose-300 font-semibold flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected Row
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleTableAction('deleteTable');
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-rose-400 font-semibold flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Entire Table
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-[1px] bg-slate-800 mx-1" />

        {/* Undo, Redo, Clear Format */}
        <button
          type="button"
          onClick={() => exec('undo')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => exec('redo')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => exec('removeFormat')}
          disabled={isHtmlMode}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        {/* View Mode Toggle */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isHtmlMode
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isHtmlMode ? 'Switch to Visual Editor' : 'Switch to HTML Code View'}
          >
            {isHtmlMode ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
            <span>{isHtmlMode ? 'Visual' : 'HTML'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {isHtmlMode ? (
        <textarea
          value={htmlCode}
          onChange={handleHtmlChange}
          placeholder="Edit raw HTML code..."
          className="w-full min-h-[200px] p-4 bg-slate-950 font-mono text-xs text-sky-300 focus:outline-none resize-y"
          rows={8}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="w-full min-h-[200px] max-h-[360px] overflow-y-auto p-4 bg-slate-950 text-slate-100 text-xs focus:outline-none leading-relaxed prose prose-invert max-w-none rich-editor-content"
          style={{ wordBreak: 'break-word' }}
          data-placeholder={placeholder}
        />
      )}

      {/* Footer Status Bar */}
      <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>Word-Style Rich Text Editor (Supports Bold, Font Size, Align, Tables & Lists)</span>
        </span>
        <span className="font-mono text-slate-500">{htmlCode.length} chars</span>
      </div>
    </div>
  );
};
