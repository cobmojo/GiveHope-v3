import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, Italic, List, Underline, Heading1, Heading2, Quote, ListOrdered
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function RichTextEditor({ value, onChange, placeholder, className, disabled }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [activeFormats, setActiveFormats] = useState<string[]>([]);
    
    // Helper to check if content is truly empty (ignoring empty tags)
    const isEmpty = !value || value === '<br>' || value === '<p><br></p>' || value.trim() === '';

    // Sync external value changes to editor
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            // Only update if the active element isn't the editor (prevents cursor jumping)
            if (document.activeElement !== editorRef.current) {
                editorRef.current.innerHTML = value;
            }
        }
    }, [value]);

    const updateActiveFormats = useCallback(() => {
        if (typeof document === 'undefined') return;
        
        const formats: string[] = [];
        
        if (document.queryCommandState('bold')) formats.push('bold');
        if (document.queryCommandState('italic')) formats.push('italic');
        if (document.queryCommandState('underline')) formats.push('underline');
        if (document.queryCommandState('insertUnorderedList')) formats.push('ul');
        if (document.queryCommandState('insertOrderedList')) formats.push('ol');
        
        const block = document.queryCommandValue('formatBlock');
        if (block && block.toLowerCase() === 'h1') formats.push('h1');
        if (block && block.toLowerCase() === 'h2') formats.push('h2');
        if (block && block.toLowerCase() === 'blockquote') formats.push('blockquote');

        setActiveFormats(formats);
    }, []);

    const onSelectionChange = useCallback(() => {
        if (document.activeElement === editorRef.current || editorRef.current?.contains(document.activeElement)) {
            updateActiveFormats();
        }
    }, [updateActiveFormats]);

    useEffect(() => {
        document.addEventListener('selectionchange', onSelectionChange);
        return () => document.removeEventListener('selectionchange', onSelectionChange);
    }, [onSelectionChange]);

    const exec = (command: string, val?: string) => {
        document.execCommand(command, false, val);
        editorRef.current?.focus();
        updateActiveFormats();
        handleInput();
    };

    const handleInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            onChange(html === '<br>' ? '' : html);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Tab indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    };

    return (
        <div className={cn(
            "border border-input rounded-md bg-background transition-all flex flex-col shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            disabled && "opacity-60 pointer-events-none bg-muted",
            className
        )}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b bg-muted/30 overflow-x-auto no-scrollbar rounded-t-md">
                <ToolbarBtn active={activeFormats.includes('bold')} onClick={() => exec('bold')} icon={<Bold size={15} />} title="Bold" />
                <ToolbarBtn active={activeFormats.includes('italic')} onClick={() => exec('italic')} icon={<Italic size={15} />} title="Italic" />
                <ToolbarBtn active={activeFormats.includes('underline')} onClick={() => exec('underline')} icon={<Underline size={15} />} title="Underline" />
                
                <div className="mx-1 h-4 w-[1px] bg-border" />
                
                <ToolbarBtn active={activeFormats.includes('h1')} onClick={() => exec('formatBlock', 'H1')} icon={<Heading1 size={16} />} title="Heading 1" />
                <ToolbarBtn active={activeFormats.includes('h2')} onClick={() => exec('formatBlock', 'H2')} icon={<Heading2 size={16} />} title="Heading 2" />
                <ToolbarBtn active={activeFormats.includes('blockquote')} onClick={() => exec('formatBlock', 'BLOCKQUOTE')} icon={<Quote size={15} />} title="Quote" />
                
                <div className="mx-1 h-4 w-[1px] bg-border" />
                
                <ToolbarBtn active={activeFormats.includes('ul')} onClick={() => exec('insertUnorderedList')} icon={<List size={15} />} title="Bullet List" />
                <ToolbarBtn active={activeFormats.includes('ol')} onClick={() => exec('insertOrderedList')} icon={<ListOrdered size={15} />} title="Numbered List" />
            </div>

            {/* Editor Area */}
            <div className="relative flex-1 cursor-text group" onClick={() => editorRef.current?.focus()}>
                {isEmpty && placeholder && (
                    <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none select-none text-sm">
                        {placeholder}
                    </div>
                )}
                
                <div
                    ref={editorRef}
                    contentEditable={!disabled}
                    onInput={handleInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    className="
                        min-h-[120px] p-4 outline-none text-sm text-foreground leading-relaxed
                        [&_b]:font-bold [&_strong]:font-bold
                        [&_i]:italic [&_em]:italic
                        [&_u]:underline
                        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2
                        [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2
                        [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-muted-foreground
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
                        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
                        [&_li]:mb-1
                    "
                />
            </div>
        </div>
    );
}

const ToolbarBtn = ({ active, onClick, icon, title }: { active: boolean, onClick: () => void, icon: React.ReactNode, title: string }) => (
    <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        className={cn(
            "p-1.5 rounded-md transition-all duration-200 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted",
            active && "bg-muted text-foreground font-medium shadow-sm"
        )}
        title={title}
    >
        {icon}
    </button>
);
