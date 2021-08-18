import React, { useState, useEffect } from 'react'

const fullscreenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 8000,
    height: '100vh',
    maxHeight: 'none',
    padding: '30px 30px',
    overflowY: 'auto'
}

const getFormulaStyle = fullscreen => ({
    background: '#444',
    position: 'relative',
    maxHeight: '10rem',
    overflow: 'hidden',
    ...(fullscreen ? fullscreenStyle : {})
})

const preStyle = {
    color: '#bbb', 
    minHeight: '2rem',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
}

const Formula = ({ children }) => {
    const [ fullscreen, setFullscreen ] = useState(false)
    useEffect(() => {
        if (fullscreen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'
        return () => document.body.style.overflow = 'auto' 
    }, [fullscreen])
    return (
        <div style={getFormulaStyle(fullscreen)}>
            <pre style={preStyle}>{children}</pre>
            <button className="btn btn-primary btn-sm" style={{ position: fullscreen ? 'fixed' : 'absolute', top: '.5rem', right: '.5rem', fontSize: '.5rem' }}
                onClick={e => setFullscreen(f => !f)}
                >
                Toggle Fullscreen
            </button>
        </div>
    )
}

export { Formula }