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
    default:
      return state
  }
}

const store = createStore(records)


class Main extends React.Component {
  getCollection() {
    fetch('https://api.discogs.com/users/mcarter78/collection/folders/0/releases?page=1&per_page=500', myInit)
      .then(function(res) {
        return res.json()
      })
      .then(function(recordData) {
        console.log(recordData.releases)
        store.dispatch({
          type: 'GETALL',
          data: recordData.releases
        })
      })
  }
  searchCollection() {
    const data = store.getState()
    data.map(function(record, index) {
      console.log(record)
    })
  }
  render() {
    return (
      <div>
        <h1>TestPressed</h1>
        <button onClick={this.getCollection}>My Collection</button>
        <form onSubmit={this.searchCollection}>
          <input type="text" name="artist-name" placeholder="Artist Name"/>
          <input type="text" name="album-title" placeholder="Album Title"/>
          <input type="submit"/>
        </form>
      </div>
    )
  }
}


const renderData = () => {
  const dataDiv = document.getElementById('data')
  let data = store.getState()
  if(data !== '') {
    data = data.sort(function(a,b) {
      if(a.basic_information.artists[0].name < b.basic_information.artists[0].name) return -1;
      if(a.basic_information.artists[0].name > b.basic_information.artists[0].name) return 1;
      return 0;
    })
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
