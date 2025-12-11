import React, { KeyboardEvent } from "react";
import styles from './InputBar.module.css';
import {FaPaperPlane} from "react-icons/fa";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isSidebarOpen: boolean;
}

export default function InputBar({
  value,
  onChange,
  onSend,
  disabled = false,
  isSidebarOpen,
  placeholder = "Type your message..."
}: Props) {

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSend(value.trim());
    }
  };

  const handleClick = () => {
    onSend(value.trim());
  };

  return (
    <div className={styles.inputBar}>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      
        <button
          className={styles.sendBtn}
          onClick={handleClick}
          disabled={disabled || !value.trim()}
          title="send"
        >
          <FaPaperPlane className={styles.sendIcon} />
        </button>
      </div>
    </div>
  );
}
