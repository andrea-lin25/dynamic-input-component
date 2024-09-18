# DynamicInput Component

## Introduction

The `DynamicInput` component is a flexible and interactive text editor built with React. It allows users to manage editable text blocks and tags (chips) seamlessly. This component supports dynamic editing, adding and deleting tags, and moving the cursor between text blocks. It's styled with Tailwind CSS for a modern look and feel.

## Component Design

### Features

- **Dynamic Text and Tags**: Users can insert and remove tags (chips) within editable text blocks.
- **Cursor Management**: Supports moving the cursor between text blocks using arrow keys.
- **Content Editing**: Users can edit text blocks directly and see real-time updates.
- **Tag Management**: Provides functionality to delete tags and merge content appropriately.

### Structure

- **Blocks**: The component maintains a state of `blocks`, which can be either text or tags. Each block has:
  - `id`: Unique identifier.
  - `type`: Defines if the block is a text or a tag.
  - `spanContent`: Content of text blocks.
  - `spanRef`: Reference to the span element of text blocks.
  - `chipContent`: Content of tag blocks.
  - `chipRef`: Reference to the div element of tag blocks.

## Event Handlers

### `handleTagClick`

**Purpose**: Handles the insertion of a new tag at the current cursor position within a text block.

**Details**:

- Checks if there is a current text block focused.
- Splits the text at the cursor position and inserts the new tag.
- Adjusts blocks array and updates the state.

### `handleDeleteTag`

**Purpose**: Handles the deletion of a tag and merges adjacent text blocks if necessary.

**Details**:

- Checks if the block at the given index is a tag.
- Merges content of adjacent text blocks if the tag is removed.
- Sets the cursor position to the end of the previous text block or the start of the current block.

### `handleBoardClick`

**Purpose**: Focuses the last text block and sets the cursor to the end of its content when the board is clicked.

**Details**:

- Focuses the span element of the last text block.
- Sets the cursor position to the end of the content.

### `handleKeyDown`

**Purpose**: Handles key press events for navigating between text blocks and deleting tags.

**Details**:

- **ArrowLeft**: Moves the cursor to the end of the previous text block if at the start.
- **ArrowRight**: Moves the cursor to the start of the next text block if at the end.
- **Backspace**: Deletes the previous tag if the cursor is at the start of a text block.
- **Delete**: Deletes the next tag if the cursor is at the end of a text block.

### `handleInput`

**Purpose**: Updates the content of a text block when the user types in it.

**Details**:

- Captures the updated content of the text block and updates the state.

## Usage

```jsx
import DynamicInput from "./components/DynamicInput";

function App() {
  return (
    <div className="App">
      <DynamicInput suggestedTags={["One", "Two", "Three", "Four", "Five"]} />
    </div>
  );
}

export default App;
```
