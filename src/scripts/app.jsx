import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import fetch from 'node-fetch'
fetch.Promise = require('bluebird')

const myInit = {
  method: 'GET',
  headers: {
    'User-Agent': 'TestPressed/1.0'
  }
}

const records = (state, action) => {
  switch(action.type) {
    case 'GETUSER':
      return state = ''
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
    if(window.localStorage.discogsUsername) {
      store.dispatch({
        type: 'GETUSER',
      })
      const userInput = document.getElementById('userInput')
      userInput.value = window.localStorage.discogsUsername
      this.getCollection(window.localStorage.discogsUsername)
    }
  }
  setUser(e) {
    e.preventDefault()
    store.dispatch({
      type: 'GETUSER',
    })
    const user = e.target.userName.value
    window.localStorage.discogsUsername = user
    this.getCollection(user)
  }
  clearUser() {
    console.log('clearing')
    window.localStorage.removeItem('discogsUsername')
    window.location.reload()
  }
  getCollection(user) {
    console.log(user)
    fetch('https://api.discogs.com/users/' + user + '/collection/folders/0/releases?page=1&per_page=900', myInit)
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
    const data = store.getState()
    let matches = []
    data.forEach(function(record) {
      let artistInput = e.target.artistName.value.toLowerCase()
      let albumInput = e.target.albumTitle.value.toLowerCase()
      let recordArtist = record.basic_information.artists[0].name.toLowerCase()
      let recordTitle = record.basic_information.title.toLowerCase()
      if(artistInput === recordArtist && albumInput === recordTitle) {
        return matches = [record]
      }
      else if(artistInput === recordArtist || albumInput === recordTitle) {
        matches.push(record)
      }
    })
    if(matches.length === 0) {
      matches.push('No Matches')
    }
    store.dispatch({
      type: 'RECORDS',
      data: matches
    })
    const main = document.getElementById('main')
    const form = document.getElementById('form')
    main.removeChild(form)
    const b = document.createElement('button')
    b.setAttribute('class', 'btn btn-primary')
    b.setAttribute('id', 'search-again')
    b.innerText = 'Search Again'
    main.appendChild(b)
    b.addEventListener('click', function() {
      window.location.reload()
    })
  }
  render() {
    return (
      <div id="main">
        <h1 id="title">LPCheck</h1>
        <h4>Powered by <img id="logo" src="/discogs.png"/></h4>
        <p>LPCheck is a simple tool to check if you own a specific record.  First, enter your Discogs.com
          username and click submit to get your collection, then search by Artist Name and/or Album Title.</p>
        <form className="form-group" onSubmit={this.setUser.bind(this)}>
          <input id="userInput" className="form-control" type="text" name="userName" placeholder="Discogs Username"/>
          <button className="btn btn-primary" type="submit">Submit Username</button><br/>
          <a href="#" onClick={this.clearUser}>clear User</a>
        </form>
        <form className="form-group" id="form" onSubmit={this.searchCollection}>
          <input className="form-control" type="text" name="artistName" placeholder="Artist Name"/>
          <input className="form-control" type="text" name="albumTitle" placeholder="Album Title"/>
          <button className="btn btn-primary" type="submit">Submit Search</button>
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
  if(Array.isArray(data)) {
    if(data[0] === 'No Matches'){
      dataDiv.innerHTML = ''
      const p = document.createElement('p')
      p.innerText = data[0]
      dataDiv.appendChild(p)
    }
    else {
      data = data.sort(function(a,b) {
        if(a.basic_information.artists[0].name < b.basic_information.artists[0].name) return -1;
        if(a.basic_information.artists[0].name > b.basic_information.artists[0].name) return 1;
        return 0;
      })
      dataDiv.innerHTML = ''
      const h4 = document.createElement('h4')
      h4.innerText = window.localStorage.discogsUsername + ' (' + data.length + ' records)'
      dataDiv.appendChild(h4)
      data.map(function(record, index) {
        const p = document.createElement('p')
        p.setAttribute('key', index)
        p.innerText = record.basic_information.artists[0].name + ' - ' + record.basic_information.title
        dataDiv.appendChild(p)
      })
    }
  }
  else if(data === '') {
    const i = document.createElement('img')
    i.setAttribute('src', '/loading_spinner.gif')
    dataDiv.appendChild(i)
  }


  ReactDOM.render(
    <Main/>,
    document.getElementById('main-component')
  )
}

renderData()

store.subscribe(renderData)
