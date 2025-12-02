import { useTheme } from '../contexts/ThemeContext'
import styles from './Header.module.css'

export function Header() {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className={styles.header}>
            <div className={styles.content}>
                <div>
                    <h1 className={styles.title}>
                        <span className={styles.gradientText}>DSL</span> Architecture Editor
                    </h1>
                    <p className={styles.subtitle}>
                        Design and visualize your system architecture with ease
                    </p>
                </div>

                <button
                    className={styles.themeToggle}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </header>
    )
}
