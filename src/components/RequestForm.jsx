import React, { Component } from "react"
import axios from "axios"

export default class RequestForm extends Component {

    state = {
        isLoading: false,
        user1: "",
        user2: "",
        errMsg: ""
    }

    onSubmit = async (e) => {
        e.preventDefault()
        this.setState({ isLoading: true, errMsg: "" })
        const { user1, user2 } = this.state
        let u1S = 0 //star counter for user 1
        let u2S = 0 //star counter for user 2
        let u1Data = null
        let u2Data = null
        await axios.get(`https://api.github.com/users/${user1}/repos?per_page=100&sort="created"`)
            .then(res => {
                res.data.map(repo => u1S += (repo.stargazers_count))
            })
            .catch(err => {
                if (err.toString().includes("404")) this.setState({ errMsg: `No se ha encontrado a ${user1}` })
                else this.setState({errMsg:`Error al intentar acceder a los repositorios de ${user1}. Intente más tarde`})
            })
        await axios.get(`https://api.github.com/users/${user2}/repos?per_page=100&sort="created"`)
            .then(res => {
                res.data.map(repo => u2S += (repo.stargazers_count))
            })
            .catch(err => {
                if (err.toString().includes("404")) this.setState({ errMsg: `No se ha encontrado a ${user2}` })
                else this.setState({errMsg:`Error al intentar acceder a los repositorios de ${user2}. Intente más tarde`})
            })
        await axios.get(`https://api.github.com/users/${user1}`)
            .then(res => u1Data = res.data)
            .catch(err => console.log(err))
        await axios.get(`https://api.github.com/users/${user2}`)
            .then(res => u2Data = res.data)
            .catch(err => console.log(err))
        const { errMsg } = this.state
        let winner = null
        if (errMsg === "") winner = (u1S > u2S ? u1Data : u2Data)
        this.props.setUsersInfo(u1Data, u2Data, winner)
        console.log(user1, u1S, user2, u2S)
        this.setState({ isLoading: false })
    }

    handleOnChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value
        this.setState(state)
    }

    render() {
        const { isLoading, user1, user2, errMsg } = this.state
        if (isLoading) return (
            <div className="loading-container">
                <div className="loading" />
                <div id="loading-text">loading...</div>
            </div>
        )
        return (
            <div className="RF-container">
                <h2>Code Star</h2>
                <p className="text-error">{errMsg}</p>
                <form onSubmit={this.onSubmit}>
                    <p></p>
                    <input type="text" placeholder="User 1" onChange={this.handleOnChange} name="user1" value={user1} required />
                    <p>VS</p>
                    <input type="text" placeholder="User 2" onChange={this.handleOnChange} name="user2" value={user2} required />
                    <p></p>
                    <input type="submit" value="Go!" />
                </form>
            </div>
        )
    }

}