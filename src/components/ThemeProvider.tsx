'use client'

import { ThemeProvider } from "next-themes"

interface ThemeProps {
    children:React.ReactNode
}

const Theme = ({children}:ThemeProps) => {
    return <ThemeProvider attribute="class">{children}</ThemeProvider>
}

export default Theme