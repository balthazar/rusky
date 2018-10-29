import React, { Component } from 'react'
import orderBy from 'lodash/orderBy'
import { MdVolumeUp, MdLink } from 'react-icons/md'

import words from '../finalWords'

const containerStyle = {
  padding: '1rem',
}

const filterSelect = {
  padding: '0.5rem',
  display: 'inline-flex',
}

const filterOption = {
  marginLeft: '0.5rem',
  cursor: 'pointer',
}

const wordsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}

const wordStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',

  background: '#ececec',
  padding: '1rem',
  margin: 10,
  width: 150,
  height: 150,
}

const playButton = {
  cursor: 'pointer',
  position: 'absolute',
  bottom: 10,
  left: 40,
  fontSize: 20,
}

const translateLink = {
  position: 'absolute',
  bottom: 10,
  left: 10,
  fontSize: 20,
  color: 'black',
}

const playSound = url => new Audio(url).play()

class Home extends Component {
  state = {
    type: null,
  }

  render() {
    const { type } = this.state
    const ordered = orderBy(type ? words.filter(w => w.type === type) : words, ['type', 'rank'])

    return (
      <div style={containerStyle}>
        <div style={filterSelect}>
          type:
          {[null, 'word', 'verb', 'noun'].map(t => (
            <span
              onClick={() => this.setState({ type: t })}
              style={{ ...filterOption, ...(t === type ? { borderBottom: '3px solid blue' } : {}) }}
              key={t}
            >
              {t || 'none'}
            </span>
          ))}
        </div>

        <div style={wordsStyle}>
          {ordered.map(
            ({ russian, link, traduction, sound, rank, gender, pair, conjugation, type }) => (
              <div style={wordStyle} key={`${russian}-${link}-${sound}`}>
                <span style={{ position: 'absolute', top: 5, left: 5, fontSize: 12 }}>
                  {type}
                  {' - '}
                  {rank}
                </span>
                <div style={{ fontSize: 20 }}>{russian}</div>
                <div style={{ textAlign: 'center' }}>{traduction}</div>

                <a
                  href={`https://translate.google.com/?source=osdd#ru/en/${russian}`}
                  style={translateLink}
                  target="_blank"
                >
                  <MdLink />
                </a>

                {sound && (
                  <span style={playButton} onClick={() => playSound(sound)}>
                    <MdVolumeUp />
                  </span>
                )}
              </div>
            ),
          )}
        </div>
      </div>
    )
  }
}

export default Home
