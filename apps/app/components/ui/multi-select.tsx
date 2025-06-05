'use client';

import {
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import * as React from 'react';

export type TTag = {
  key: string;
  name: string;
};

type MultipleSelectProps = {
  tags: TTag[];
  customTag?: (item: TTag) => ReactNode | string;
  onChange?: (value: string[]) => void;
  value?: string[];
};

export const MultipleSelect = ({
  tags,
  customTag,
  onChange,
  value,
}: MultipleSelectProps) => {
  const [selected, setSelected] = useState<TTag[]>(() => {
    if (!value) return [];
    return value.map(name => tags.find(tag => tag.name === name)).filter(Boolean) as TTag[];
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      const newSelected = value
        .map(name => tags.find(tag => tag.name === name))
        .filter(Boolean) as TTag[];
      setSelected(newSelected);
    }
  }, [value, tags]);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollBy({
        left: containerRef.current?.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [selected]);

  const onValueChange = (selectedTags: TTag[]) => {
    onChange?.(selectedTags.map(tag => tag.name));
  };

  const onSelect = (item: TTag) => {
    const newSelected = [...selected, item];
    setSelected(newSelected);
    onValueChange(newSelected);
  };

  const onDeselect = (item: TTag) => {
    const newSelected = selected.filter((i) => i.key !== item.key);
    setSelected(newSelected);
    onValueChange(newSelected);
  };

  return (
    <AnimatePresence mode="popLayout">
      <div className="flex w-full max-w-md flex-col gap-2">
        <motion.div
          layout
          ref={containerRef}
          className="flex h-12 items-center overflow-x-auto rounded-[var(--radius-md)] border border-border bg-muted px-2 py-1 no-scrollbar"
        >
          <motion.div layout className="flex items-center gap-2">
            {selected.map((item) => (
              <Tag
                name={item.name}
                key={item.key}
                className="bg-card text-foreground border border-border"
              >
                <div className="flex items-center gap-1.5">
                  <motion.span layout className="whitespace-nowrap">
                    {item.name}
                  </motion.span>
                  <button
                    className="hover:text-destructive hover:cursor-pointer transition-colors"
                    onClick={() => onDeselect(item)}
                  >
                    <X size={14} />
                  </button>
                </div>
              </Tag>
            ))}
          </motion.div>
        </motion.div>

        {tags.length > selected.length && (
          <div className="flex flex-wrap gap-2 rounded-[var(--radius-md)] border border-border p-2">
            {tags
              .filter((item) => !selected.some((i) => i.key === item.key))
              .map((item) => (
                <Tag
                  name={item.name}
                  onClick={() => onSelect(item)}
                  key={item.key}
                  className="bg-muted hover:bg-secondary transition-colors"
                >
                  {customTag ? (
                    customTag(item)
                  ) : (
                    <motion.span layout className="whitespace-nowrap">
                      {item.name}
                    </motion.span>
                  )}
                </Tag>
              ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

type TagProps = PropsWithChildren &
  Pick<HTMLAttributes<HTMLDivElement>, 'onClick'> & {
    name?: string;
    className?: string;
  };

export const Tag = ({ children, className, name, onClick }: TagProps) => {
  return (
    <motion.div
      layout
      layoutId={name}
      onClick={onClick}
      className={`cursor-pointer rounded-[var(--radius-sm)] px-3 py-1.5 text-sm ${className}`}
    >
      {children}
    </motion.div>
  );
};
