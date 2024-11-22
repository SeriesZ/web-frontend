import React, { useState, useRef, useEffect } from "react";
import styles from "./CustomSelectBox.module.scss";
import { Category } from "@/model/IdeaList";

interface CustomSelectBoxProps {
  options: Category[];
  value?: Category; // 선택된 값의 prop을 추가합니다.
  placeholder?: string;
  onSelect: (value: Category) => void;
}

const CustomSelectBox: React.FC<CustomSelectBoxProps> = ({
  options,
  value,
  placeholder,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(
    placeholder || "Select..."
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 선택된 값에 따라 레이블을 업데이트하는 부분을 추가합니다.
  useEffect(() => {
    if (value) {
      const selectedOption = options.find((option) => option.id === value.id);
      if (selectedOption) {
        setSelectedLabel(selectedOption.name);
      }
    } else {
      setSelectedLabel(placeholder || "Select...");
    }
  }, [value, options, placeholder]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (option: Category) => {
    setSelectedLabel(option.name);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.customSelectBox} ref={wrapperRef}>
      <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
        {selectedLabel}
      </div>
      {isOpen && (
        <ul className={styles.options}>
          {options.map((option) => (
            <li
              key={option.id}
              className={styles.option}
              onClick={(event) => {
                event.stopPropagation();
                handleSelect(option);
              }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelectBox;
