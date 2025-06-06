"use client"

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"

import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview
} from "@/lib/hooks/useFileUpload"

import { Button } from "@/components/ui/button"

interface InputImageProps {
  onChange?: (images: FileWithPreview[]) => void;
  value?: (FileWithPreview | string)[];
}

export function InputImage({ onChange, value }: InputImageProps) {
  const maxSizeMB = 5
  const maxSize = maxSizeMB * 1024 * 1024 // 5MB default
  const maxFiles = 6

  // Convert FileWithPreview to FileMetadata if needed for initialFiles
  const initialFiles = value ? value.map(file => {
    if (typeof file === 'object' && 'file' in file && 'preview' in file) {
      return {
        id: crypto.randomUUID(),
        name: file.file.name,
        size: file.file.size,
        type: file.file.type,
        url: file.preview
      } as FileMetadata;
    }

    // If it's a string (URL), create a minimal FileMetadata
    if (typeof file === 'string') {
      return {
        id: crypto.randomUUID(),
        name: 'unknown',
        size: 0,
        type: 'unknown',
        url: file
      } as FileMetadata;
    }

    return;
  }).filter((file): file is FileMetadata => file !== undefined) : [];

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
    multiple: true,
    maxFiles,
    initialFiles: initialFiles,
  })

  // Sync files with parent component when files change
  useEffect(() => {
    if (onChange) {
      onChange(files);
    }
  }, [files, onChange]);

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px] cursor-pointer"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />
        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)]"
            aria-hidden="true"
          >
            <ImageIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
          <p className="text-muted-foreground text-xs">
            SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-card flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] p-2 pe-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-accent aspect-square shrink-0 rounded">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-10 rounded-[inherit] object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-[13px] font-medium">
                    {file.file.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatBytes(file.file.size)}
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                onClick={() => removeFile(file.id)}
                aria-label="Remove file"
              >
                <XIcon aria-hidden="true" />
              </Button>
            </div>
          ))}

          {/* Remove all files button */}
          {files.length > 1 && (
            <div>
              <Button size="sm" variant="outline" onClick={clearFiles}>
                Remove all files
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}