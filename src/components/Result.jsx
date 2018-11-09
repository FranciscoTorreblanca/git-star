import React from "react"

function Result({ winner }) {
    return (
        <div>
            <section className="Result-winner">
                <h2>Ganador: {winner.name}  ({winner.login})</h2>
                <br />
                <a href={winner.html_url}>
                    <img src={winner.avatar_url} alt="winner avatar" />
                </a>
            </section>
        </div>
    )
}

export default Result