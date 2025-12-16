"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./SideBar.module.css";
import {FaSearch,FaBook,FaClock,FaPen,FaBalanceScale,FaBars,FaChevronRight,FaChevronLeft,FaCog,FaSignOutAlt,FaUserCircle,FaQuestionCircle,FaMoon,FaSun,} from "react-icons/fa";
import { useChat } from "../app/layout";

interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function SideBar({ isOpen, toggleSidebar }: SideBarProps) {
  const [theme, setTheme] = useState("dark");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userSectionRef = useRef<HTMLDivElement>(null);
  const { resetChat } = useChat();

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = saved ?? "dark";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);

    
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen && userMenuRef.current && userSectionRef.current) {
        const target = event.target as HTMLElement;
        
        if (!userSectionRef.current.contains(target) && 
            !userMenuRef.current.contains(target)) {
          setUserMenuOpen(false);
        }
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const router = useRouter();

  const handleLogout = () => {
    router.push("/auth/login");
  };

  
  

  return (
    <>
      
      <button
        className={`${styles.mobileMenuBtn} ${styles.mobileOnly}`}
        onClick={() => setMobileOpen(true)}
      >
        <FaBars />
      </button>

      {mobileOpen && <div className={styles.sidebarOverlay} onClick={() => setMobileOpen(false)} />}

      <aside
        className={`${styles.sideBar} ${!isOpen ? styles.closed : ""} ${
          mobileOpen ? styles.open : ""
        }`}
      >
        <div className={styles.sidebarContent}>
          <div className={styles.headerRow}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}>
                <FaBalanceScale className={styles.icon} />
              </div>
              <button 
                className={`${styles.menuBtn} ${styles.desktopOnly}`}
                onClick={toggleSidebar}
              >
                {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
              </button>
            </div>

            {mobileOpen && (
              <button
                className={`${styles.closeBtn} ${styles.mobileOnly}`}
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </button>
            )}
          </div>

          
          <div className={styles.chatList}>
            <div className={styles.chatItem} onClick={resetChat}>
              <FaPen /> <span>New Chat</span>
            </div>
            <div className={styles.chatItem} onClick={() => setIsSearchOpen(true)}>
              <FaSearch /> <span>Search Chat</span>
            </div>
            <div className={styles.chatItem}>
              <FaBook /> <span>Library</span>
            </div>
            <div className={styles.chatItem}>
              <FaClock /> <span>History</span>
            </div>
          </div>
        </div>

        
        <div className={styles.userSection} ref={userSectionRef}>
          {userMenuOpen && (
            <div 
              ref={userMenuRef}
              className={styles.userMenu}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.userMenuItem} onClick={toggleTheme}>
                <span className={styles.icon}>{theme === "dark" ? <FaSun /> : <FaMoon />}</span>
                {isOpen && <span className={styles.label}>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
              </div>
              <div className={styles.userMenuItem}>
                <span className={styles.icon}><FaCog /></span>
                {isOpen && <span className={styles.label}>Settings</span>}
              </div>
              <div className={styles.userMenuItem}>
                <span className={styles.icon}><FaQuestionCircle /></span>
                {isOpen && <span className={styles.label}>Help</span>}
              </div>
              <div className={styles.userMenuItem} onClick={handleLogout}>
                <span className={styles.icon}><FaSignOutAlt /></span>
                {isOpen && <span className={styles.label}>Logout</span>}
              </div>
            </div>
          )}
          <div
            className={styles.userInfo}
            onClick={(e) => {
              e.stopPropagation();
              setUserMenuOpen((prev) => !prev);
            }}
          >
            <FaUserCircle className={styles.userAvatar} />
            {isOpen && (
              <div className={styles.userDetails}>
                <p className={styles.userName}>Mansi</p>
                <p className={styles.userEmail}>mansi@example.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      
      {isSearchOpen && (
        <div
          className={styles.searchOverlay}
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className={styles.searchModal}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Search chats..."
              className={styles.searchInput}
              autoFocus
            />
            <div className={styles.searchResults}>
              <div className={styles.searchItem}>New Chat</div>
              <div className={styles.searchItem}>Indian Penal Code</div>
              <div className={styles.searchItem}>Constitution of India</div>
              <div className={styles.searchItem}>Honour Mudering Cases</div>
              <div className={styles.searchItem}>Theft Cases</div>
              <div className={styles.searchItem}>Corruption cases</div>
              <div className={styles.searchItem}>Arson Cases</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

