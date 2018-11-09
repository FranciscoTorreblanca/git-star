import React, { Component } from 'react'
import './App.css'
import RequestForm from './components/RequestForm'
import Result from './components/Result'
import axios from 'axios';

class App extends Component {

  state = {
    user1: null,
    user2: null,
    winner: null,
    activeUser: null,
    repos: []
  }

  setUsersInfo = (user1, user2, winner) => {
    this.setState({ user1, user2, winner, activeUser: winner })
  }

  reset = () => {
    this.setState({ winner: null, user1: null, user2: null })
  }

  setActiveUser = (e) => {
    console.log(e.target.name)
    const { user1, user2 } = this.state
    let activeUser = user1
    if (e.target.name === "user2Button") activeUser = user2
    this.setState({ activeUser })
  }

  getRepositories = async (actUser) => {
    if (actUser === null) return
    let repos
    await axios.get(`${actUser.repos_url}?per_page=100&sort="created"`)
      .then(res => repos = res.data)
      .catch(err => console.log(err))
    repos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count)
    return this.setState({ repos })
  }

  componentDidUpdate() {
    this.getRepositories(this.state.activeUser)
  }

  render() {
    const { winner, user1, user2, repos, activeUser } = this.state
    let reposErrMsg = ""
    if (repos.length < 1) reposErrMsg = "Sin repositorios"
    else reposErrMsg=""
    if (winner !== null) return (
      <div>
        <button onClick={this.reset} >Reset</button>
        <Result winner={winner} />
        <section className="Result-tabs">
          <button onClick={this.setActiveUser} name="user1Button">{user1.login}</button>
          <button onClick={this.setActiveUser} name="user2Button">{user2.login}</button>
        </section>
        <section>
          <h3>Repositorios de {activeUser.name} ({activeUser.login}) </h3>
          <a href={activeUser.html_url}> <img src={activeUser.avatar_url} alt="User avatar" width="5%" /> </a>
          {reposErrMsg}
          <ul>
            {repos.map((repo, index) => {
              return (
                <li key={index}>
                  <a href={repo.html_url}>{repo.stargazers_count} -- {repo.name}</a>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    )
    return (
      <div>
        <RequestForm setUsersInfo={this.setUsersInfo} />
      </div>
    )
  }
}

export default App
