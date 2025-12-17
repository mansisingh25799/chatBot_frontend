import React, { KeyboardEvent } from "react";
import styles from './InputBar.module.css';
import { FaPaperPlane, FaSmile, FaPaperclip, FaMicrophone } from "react-icons/fa";

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
        <button className={styles.iconButton} title="Emoji">
          <FaSmile />
        </button>
        
        <input
          className={styles.input}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      
        <button className={styles.iconButton} title="Attachment">
          <FaPaperclip />
        </button>
        
        {value.trim() ? (
          <button
            className={styles.sendBtn}
            onClick={handleClick}
            disabled={disabled || !value.trim()}
            title="Send"
          >
            <FaPaperPlane className={styles.sendIcon} />
          </button>
        ) : (
          <button className={styles.iconButton} title="Voice">
            <FaMicrophone />
          </button>
        )}
      </div>
    </div>
  );
}
