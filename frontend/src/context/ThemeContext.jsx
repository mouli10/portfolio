import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(true)

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setIsDark(savedTheme === 'dark')
        }
    }, [])

    const toggleTheme = () => {
        setIsDark(prev => {
            const newTheme = !prev
            localStorage.setItem('theme', newTheme ? 'dark' : 'light')
            return newTheme
        })
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <div className={isDark ? 'dark' : 'light'}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}
