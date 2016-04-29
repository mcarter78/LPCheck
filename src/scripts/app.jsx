import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'

const myHeaders = new Headers({
  'User-Agent': 'TestPressed/1.0'
})

const myInit = {
  method: 'GET',
  headers: myHeaders
}

const records = (state='', action) => {
  switch(action.type) {
    case 'GETALL':
      return state = action.data
    case 'RECORDS':
      return state = action.data
    default:
      return state
  }
}

const store = createStore(records)

class Main extends React.Component {
  componentDidMount() {
    this.getCollection()
  }
  getCollection() {
    fetch('https://api.discogs.com/users/mcarter78/collection/folders/0/releases?page=1&per_page=500', myInit)
      .then(function(res) {
        return res.json()
      })
      .then(function(recordData) {
        store.dispatch({
          type: 'GETALL',
          data: recordData.releases
        })
      })
  }
  searchCollection(e) {
    e.preventDefault()
    console.log(e.target.artistName.value)
    const data = store.getState()
    const matches = []
    data.map(function(record, index) {
      let artistInput = e.target.artistName.value.toLowerCase()
      let albumInput = e.target.albumTitle.value.toLowerCase()
      let recordArtist = record.basic_information.artists[0].name.toLowerCase()
      let recordTitle = record.basic_information.title.toLowerCase()
      if(artistInput === recordArtist || albumInput === recordTitle) {
        matches.push(record)
      }
    })
    console.log(matches)
    store.dispatch({
      type: 'RECORDS',
      data: matches
    })
    e.target.artistName.value = ''
    e.target.albumTitle.value = ''
  }
  render() {
    return (
      <div>
        <h1>TestPressed</h1>
        <form onSubmit={this.searchCollection}>
          <input type="text" name="artistName" placeholder="Artist Name"/>
          <input type="text" name="albumTitle" placeholder="Album Title"/>
          <input type="submit"/>
        </form>
      </div>
    )
  }
}


const renderData = () => {
  console.log('new data')
  const dataDiv = document.getElementById('data')
  let data = store.getState()
  console.log(data)
  if(data !== '') {
    data = data.sort(function(a,b) {
      if(a.basic_information.artists[0].name < b.basic_information.artists[0].name) return -1;
      if(a.basic_information.artists[0].name > b.basic_information.artists[0].name) return 1;
      return 0;
    })
    dataDiv.innerHTML = ''
    data.map(function(record, index) {
      const p = document.createElement('p')
      p.setAttribute('key', index)
      p.innerText = record.basic_information.artists[0].name + ' - ' + record.basic_information.title
      dataDiv.appendChild(p)
    })
  }
  ReactDOM.render(
    <Main/>,
    document.getElementById('main-component')
  )
}

renderData()

store.subscribe(renderData)
