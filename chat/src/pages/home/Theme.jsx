import React from 'react'
import useTheme from '../../context/ThemeContext'
import { Button } from '../../components/ui/button'
import { Sun,Moon } from 'lucide-react'

function Theme() {
    const {theme,toggleTheme}=useTheme()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors bg-white dark:bg-gray-900 text-black dark:text-white">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
        aria-label="Toggle Theme"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <h1 className="text-4xl font-bold mb-4">Welcome to My React App</h1>
      <p className="text-lg">This is a simple homepage with theme toggle.</p>
      <Button size="lg">Hello</Button>
    </div>
  )
}

export default Theme