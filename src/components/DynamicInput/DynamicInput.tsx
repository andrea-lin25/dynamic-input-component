"use client";

import React, { useState, RefObject, useEffect } from "react";
import Chip from "../Chip";

type Block = {
  id: number;
  type: "text" | "tag";
  spanContent?: string;
  spanRef?: RefObject<HTMLSpanElement>;
  chipContent?: string;
  chipRef?: RefObject<HTMLDivElement>;
};

type DynamicInputProps = {
  suggestedTags: string[];
};

const DynamicInput: React.FC<DynamicInputProps> = ({ suggestedTags = [] }) => {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 0,
      type: "text",
      spanContent: " ",
      spanRef: React.createRef<HTMLDivElement>(),
    },
  ]);

  const handleTagClick = (tag: string) => {
    const newTag: Block = {
      type: "tag",
      id: Date.now(),
      chipRef: React.createRef<HTMLDivElement>(),
      chipContent: tag,
    };

    const currentSelection = window.getSelection();
    if (currentSelection && currentSelection.anchorNode) {
      const focusedIndex = blocks.findIndex((block) => {
        return (
          block.spanRef?.current === currentSelection.focusNode ||
          block.spanRef?.current === currentSelection.focusNode?.parentElement
        );
      });

      if (focusedIndex >= 0) {
        const focusedBlock = blocks[focusedIndex];
        const nodeValue = currentSelection.anchorNode.nodeValue || "";
        const spanPartAM = nodeValue
          .substring(0, currentSelection.anchorOffset)
          .trim();
        const spanPartPM = nodeValue
          .substring(currentSelection.anchorOffset)
          .trim();

        const updatedBlocks = [
          ...blocks.slice(0, focusedIndex),
          {
            ...focusedBlock,
            spanContent: spanPartAM,
          } as Block,
          newTag,
          {
            type: "text",
            id: Date.now(),
            spanContent: spanPartPM,
            spanRef: React.createRef<HTMLSpanElement>(),
          } as Block,
          ...blocks.slice(focusedIndex + 1),
        ];

        setBlocks(updatedBlocks);
      }
    } else {
      const lastBlock = blocks[blocks.length - 1];

      if (lastBlock.type === "text") {
        const updatedBlocks = [
          ...blocks,
          newTag,
          {
            type: "text",
            id: Date.now(),
            spanContent: "",
            spanRef: React.createRef<HTMLSpanElement>(),
          } as Block,
        ];

        setBlocks(updatedBlocks);
      } else {
        const updatedBlocks = [
          ...blocks,
          {
            type: "text",
            id: Date.now(),
            spanContent: "",
            spanRef: React.createRef<HTMLSpanElement>(),
          } as Block,
          newTag,
          {
            type: "text",
            id: Date.now(),
            spanContent: "",
            spanRef: React.createRef<HTMLSpanElement>(),
          } as Block,
        ];

        setBlocks(updatedBlocks);
      }
    }
  };
  const handleDeleteTag = (index: number) => {
    if (blocks[index].type !== "tag") return;

    const previousBlock = blocks[index - 1];
    const nextBlock = blocks[index + 1];

    let updatedBlocks: Block[];

    if (previousBlock?.type === "text" && nextBlock?.type === "text") {
      const mergedContent =
        (previousBlock.spanContent ?? "") + (nextBlock.spanContent ?? "");

      updatedBlocks = [
        ...blocks.slice(0, index - 1),
        {
          ...previousBlock,
          spanContent: mergedContent,
        },
        ...blocks.slice(index + 2),
      ];
    } else {
      updatedBlocks = [...blocks.slice(0, index), ...blocks.slice(index + 1)];
    }

    setBlocks(updatedBlocks);

    const newIndex = previousBlock ? index - 1 : index;
    const blockToFocus = updatedBlocks[newIndex];

    if (blockToFocus.type === "text" && blockToFocus.spanRef?.current) {
      const spanElement = blockToFocus.spanRef.current;

      spanElement.focus();

      // Set the cursor to the end of the content
      const range = document.createRange();
      const selection = window.getSelection();

      if (spanElement.lastChild) {
        range.setStart(
          spanElement.lastChild,
          (spanElement.lastChild as Node).textContent?.length || 0
        );
        range.setEnd(
          spanElement.lastChild,
          (spanElement.lastChild as Node).textContent?.length || 0
        );
      } else {
        range.setStart(spanElement, 0);
        range.setEnd(spanElement, 0);
      }

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const handleBoardClick = () => {
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock.type === "text" && lastBlock.spanRef?.current) {
      const spanElement = lastBlock.spanRef.current;

      spanElement.focus();

      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(spanElement);
      range.collapse(false);
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLSpanElement>,
    index: number
  ) => {
    const { key } = e;
    const selection = window.getSelection();

    if (!selection || !selection.focusNode) return;

    const currentSpan = e.currentTarget;
    const cursorPosition = selection.focusOffset;

    if (key === "ArrowLeft") {
      if (cursorPosition <= 0 && index > 0) {
        let textIndex = index - 1;

        while (textIndex >= 0 && blocks[textIndex].type === "tag") {
          textIndex--;
        }

        const previousBlock = blocks[textIndex];
        if (previousBlock?.type === "text" && previousBlock.spanRef?.current) {
          const spanElement = previousBlock.spanRef.current;

          spanElement.focus();
          e.preventDefault();
          e.stopPropagation();

          const range = document.createRange();
          const newSelection = window.getSelection();

          if (spanElement.lastChild) {
            range.setStart(
              spanElement.lastChild,
              (spanElement.lastChild as Node).textContent?.length || 0
            );
            range.setEnd(
              spanElement.lastChild,
              (spanElement.lastChild as Node).textContent?.length || 0
            );
          } else {
            range.setStart(spanElement, 0);
            range.setEnd(spanElement, 0);
          }

          if (newSelection) {
            newSelection.removeAllRanges();
            newSelection.addRange(range);
          }
        }
      }
    } else if (key === "ArrowRight") {
      if (
        cursorPosition === currentSpan.textContent?.length &&
        index < blocks.length - 1
      ) {
        let textIndex = index + 1;

        while (textIndex < blocks.length && blocks[textIndex].type === "tag") {
          textIndex++;
        }

        const nextBlock = blocks[textIndex];
        if (nextBlock?.type === "text" && nextBlock.spanRef?.current) {
          const spanElement = nextBlock.spanRef.current;

          spanElement.focus();
          e.preventDefault();
          e.stopPropagation();

          const range = document.createRange();
          const newSelection = window.getSelection();
          range.setStart(spanElement.firstChild || spanElement, 0);
          range.collapse(true);
          if (newSelection) {
            newSelection.removeAllRanges();
            newSelection.addRange(range);
          }
        }
      }
    } else if (key === "Backspace") {
      if (
        cursorPosition <= 0 &&
        index > 0 &&
        blocks[index - 1].type === "tag"
      ) {
        handleDeleteTag(index - 1);
        e.preventDefault();
      }
    } else if (key === "Delete") {
      if (
        cursorPosition === currentSpan.textContent?.length &&
        index < blocks.length - 1 &&
        blocks[index + 1].type === "tag"
      ) {
        handleDeleteTag(index + 1);
        e.preventDefault();
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLSpanElement>, index: number) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].spanContent = e.currentTarget.innerHTML;
    setBlocks(updatedBlocks);
  };

  useEffect(() => {
    blocks.forEach((block) => {
      if (block.type === "text" && block.spanRef?.current) {
        const currentHTML = block.spanRef.current.innerHTML;
        const spanContent = block.spanContent ?? "";

        if (currentHTML !== spanContent) {
          block.spanRef.current.innerHTML = spanContent;
        }
      }
    });
  }, [blocks]);

  return (
    <div className="border p-2 rounded w-full max-w-lg">
      <div
        className="border p-2 flex flex-wrap items-center rounded"
        onClick={handleBoardClick}
      >
        {blocks.map((block, index) =>
          block.type === "text" ? (
            <span
              className="w-fit h-full focus:outline-none focus:ring-0"
              key={index}
              contentEditable
              ref={block.spanRef}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            ></span>
          ) : (
            <Chip
              key={block.id}
              label={block.chipContent ?? ""}
              onDelete={() => handleDeleteTag(index)}
            />
          )
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        {suggestedTags.map((tag, idx) => (
          <button
            key={idx}
            onClick={() => handleTagClick(tag)}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DynamicInput;
