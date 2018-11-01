import React, { Component } from 'react'
import orderBy from 'lodash/orderBy'
import { MdVolumeUp, MdLink } from 'react-icons/md'
import { AutoSizer, List } from 'react-virtualized'

import words from '../finalWords'

const containerStyle = {
  padding: '1rem',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
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
  flex: 1,
}

const wordStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',

  background: '#ececec',
  padding: '1rem',
  borderBottom: '3px solid white',
}

const checkMark = {
  position: 'absolute',
  top: 0,
  right: 0,
  cursor: 'pointer',
  display: 'block',
  width: 0,
  height: 0,
  borderLeft: '32px solid transparent',
  borderTop: '32px solid #21c645',
}

const playButton = {
  cursor: 'pointer',
  position: 'absolute',
  bottom: 5,
  left: 40,
  fontSize: 20,
}

const translateLink = {
  position: 'absolute',
  bottom: 5,
  left: 10,
  fontSize: 20,
  color: 'black',
}

const knownLabels = {
  null: 'either',
  true: 'yes',
  false: 'no',
}

const playSound = url => new Audio(url).play()

const getKnown = () => require('../knownWords')

const filterStuff = (list, searchText, known) =>
  searchText
    ? list.filter(w => w.traduction.includes(searchText) || w.russian.includes(searchText))
    : known !== null
      ? list.filter(w => known === (getKnown()[w.id] || false))
      : list

const makeWords = ({ known = null, searchText } = {}) => {
  const { word, noun, verb } = words.reduce(
    (acc, word) => {
      acc[word.type].push(word)
      return acc
    },
    { word: [], noun: [], verb: [] },
  )

  return {
    word: orderBy(filterStuff(word, searchText, known), ['rank']),
    noun: orderBy(filterStuff(noun, searchText, known), ['rank']),
    verb: orderBy(filterStuff(verb, searchText, known), ['rank']),
  }
}

class Home extends Component {
  state = {
    known: null,
    searchText: '',
    words: makeWords(),
  }

  changeKnown = known => {
    const { searchText } = this.state

    this.setState({
      known,
      words: makeWords({ known, searchText }),
    })
  }

  toggleKnown = async id => {
    const { known, searchText } = this.state

    await fetch(`/known/${id}`)
    this.setState({
      words: makeWords({ known, searchText }),
    })
  }

  changeSearch = e => {
    const { known } = this.state
    const searchText = e.target.value
    this.setState({ searchText, words: makeWords({ known, searchText }) })
  }

  rowRenderer = type => ({ key, index, style }) => {
    const {
      id,
      russian,
      link,
      traduction,
      sound,
      rank,
      gender,
      pair,
      conjugation,
    } = this.state.words[type][index]

    return (
      <div style={{ ...wordStyle, ...style }} key={key}>
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

        <span
          style={{ ...checkMark, borderTopColor: getKnown()[id] ? '#21c645' : 'orange' }}
          onClick={() => this.toggleKnown(id)}
        />

        {sound && (
          <span style={playButton} onClick={() => playSound(sound)}>
            <MdVolumeUp />
          </span>
        )}

        {conjugation && (
          <div style={{ marginTop: '1rem' }}>
            {conjugation.map(c => (
              <div key={c.person}>
                {c.person}
                {' - '}
                {c.traduction}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  render() {
    const { words, known, searchText } = this.state

    return (
      <div style={containerStyle}>
        <div style={filterSelect}>
          known:
          {[null, true, false].map(t => (
            <span
              onClick={() => this.changeKnown(t)}
              style={{
                ...filterOption,
                ...(t === known ? { borderBottom: '3px solid blue' } : {}),
              }}
              key={t}
            >
              {knownLabels[t]}
            </span>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={searchText}
            onChange={this.changeSearch}
            style={{ background: '#ececec', padding: '0.5rem' }}
            placeholder="search.."
          />
        </div>

        <div style={{ flex: 1, marginTop: '2rem' }}>
          <AutoSizer>
            {({ height }) => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100vw',
                  flex: 1,
                }}
              >
                <div style={wordsStyle}>
                  <List
                    width={350}
                    height={height}
                    rowCount={words.word.length}
                    rowHeight={60}
                    rowRenderer={this.rowRenderer('word')}
                  />
                </div>

                <div style={wordsStyle}>
                  <List
                    width={350}
                    height={height}
                    rowCount={words.noun.length}
                    rowHeight={60}
                    rowRenderer={this.rowRenderer('noun')}
                  />
                </div>

                <div style={wordsStyle}>
                  <List
                    width={350}
                    height={height}
                    rowCount={words.verb.length}
                    rowHeight={300}
                    rowRenderer={this.rowRenderer('verb')}
                  />
                </div>
              </div>
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }
}

export default Home
