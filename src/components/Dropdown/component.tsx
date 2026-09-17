import React, { useRef } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useClickAway } from "react-use";

interface DropdownItem {
  title: string;
  path: string;
  target?: string;
}

interface DropdownProps {
  title: string;
  items: DropdownItem[];
  isOpen: boolean;
  onClose: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  items,
  isOpen,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickAway(dropdownRef, () => {
    if (isOpen) {
      onClose();
    }
  });

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => onClose()}
        className={`flex items-center gap-1 text-sm md:text-[14px] lg:text-[15px] font-medium text-blacky-light transition-colors duration-200 py-6 px-2 ${
          isOpen ? "text-green-600" : "hover:text-green-600"
        }`}
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
      </button>
      {isOpen && (
       <ul className="absolute mt-0.2 py-0.5 bg-white border border-gray-200 shadow-lg rounded-lg text-black text-xs w-max">

          {items.map((item, index) => (
            <Link href={item.path} key={index}>
              <li className="hover:bg-gray-100 rounded-lg cursor-pointer">
               <p className="block text-gray-500 hover:text-black px-4 py-[8px] whitespace-nowrap"

                  onClick={onClose}
                >
                  {item.title}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;