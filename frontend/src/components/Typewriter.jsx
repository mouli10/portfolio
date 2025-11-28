import { useState, useEffect } from 'react'

const Typewriter = ({ words, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000 }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [currentText, setCurrentText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        if (!words || words.length === 0) return

        const currentWord = words[currentWordIndex]

        const handleTyping = () => {
            if (isPaused) {
                setTimeout(() => {
                    setIsPaused(false)
                    setIsDeleting(true)
                }, pauseDuration)
                return
            }

            if (!isDeleting) {
                // Typing
                if (currentText.length < currentWord.length) {
                    setCurrentText(currentWord.substring(0, currentText.length + 1))
                } else {
                    setIsPaused(true)
                }
            } else {
                // Deleting
                if (currentText.length > 0) {
                    setCurrentText(currentWord.substring(0, currentText.length - 1))
                } else {
                    setIsDeleting(false)
                    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
                }
            }
        }

        const timeout = setTimeout(
            handleTyping,
            isPaused ? 0 : isDeleting ? deletingSpeed : typingSpeed
        )

        return () => clearTimeout(timeout)
    }, [currentText, isDeleting, isPaused, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration])

    if (!words || words.length === 0) {
        return <span>Full Stack Developer</span>
    }

    return (
        <span className="inline-flex items-center">
            {currentText}
            <span className="ml-1 w-0.5 h-6 bg-primary-500 animate-pulse"></span>
        </span>
    )
}

export default Typewriter
