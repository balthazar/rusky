import React from 'react'

import words from '../words'

const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: '1rem',
}

const wordStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',

  background: '#ececec',
  padding: '1rem',
  margin: 5,
  width: 100,
  height: 100,
}

export default function Home() {
  return (
    <div>
      <div style={containerStyle}>
        {words.map(({ word, trans }, i) => (
          <div style={wordStyle} key={word}>
            <span style={{ position: 'absolute', top: 5, left: 5, fontSize: 12 }}>{i + 1}</span>
            <div style={{ fontSize: 20 }}>{word}</div>
            <div style={{ textAlign: 'center' }}>{trans}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
