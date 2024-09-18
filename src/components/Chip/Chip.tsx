import React from 'react';

type ChipProps = {
  label: string;
  onDelete: () => void;
};

const Chip: React.FC<ChipProps> = ({ label, onDelete }) => {
  return (
    <div className="flex items-center bg-gray-200 text-black font-bold py-1 px-2 mx-1 rounded-full hover:bg-gray-300 transition-colors duration-200">
      <span className="mr-1 text-sm">{label}</span>
      <button
        onClick={onDelete}
        className="bg-black text-white w-4 h-4 flex items-center justify-center rounded-full text-xs focus:outline-none hover:bg-gray-700 transition-colors duration-200"
      >
        &#10005;
      </button>
    </div>
  );
};

export default Chip;
