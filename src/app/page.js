"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [data, setData] = useState(null);
    const [decisionFilter, setDecisionFilter] = useState("All");
    const [voteFilter, setVoteFilter] = useState("All");

    useEffect(() => {
        fetch("/api/votes/affairs/20220075?lang=de&format=json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((error) => console.error("Fetching error:", error));
    }, []);

    const handleDecisionFilterChange = (event) => {
        setDecisionFilter(event.target.value);
    };

    const handleVoteFilterChange = (event) => {
        setVoteFilter(event.target.value);
    };

    const getFilteredVotes = (councillorVotes) => {
        if (decisionFilter === "All") return councillorVotes;
        return councillorVotes.filter(vote => vote.decision === decisionFilter);
    };

    const getFilteredAffairVotes = (affairVotes) => {
        if (voteFilter === "All") return affairVotes;
        return affairVotes.filter(affairVote => affairVote.id === parseInt(voteFilter));
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-3xl font-bold">Parlament Abstimmungen</h1>
            <div className="flex flex-col items-center">
                {data && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">{data.title}</h2>
                        <div className="mb-4">
                            <label htmlFor="decisionFilter" className="mr-2">Filter nach Entscheidung:</label>
                            <select id="decisionFilter" value={decisionFilter} onChange={handleDecisionFilterChange}>
                                <option value="All">Alle</option>
                                <option value="Yes">Ja</option>
                                <option value="No">Nein</option>
                                <option value="EH">Enthaltung</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="voteFilter" className="mr-2">Filter nach Abstimmung:</label>
                            <select id="voteFilter" value={voteFilter} onChange={handleVoteFilterChange}>
                                <option value="All">Alle</option>
                                {data.affairVotes.map((affairVote) => (
                                    <option key={affairVote.id} value={affairVote.id}>{affairVote.divisionText}</option>
                                ))}
                            </select>
                        </div>
                        {getFilteredAffairVotes(data.affairVotes).map((affairVote) => {
                            let yesCount = 0;
                            let noCount = 0;
                            let ehCount = 0;
                            let totalCount = 0;

                            affairVote.councillorVotes.forEach((vote) => {
                                if (vote.decision === "Yes") {
                                    yesCount++;
                                } else if (vote.decision === "No") {
                                    noCount++;
                                } else if (vote.decision === "EH") {
                                    ehCount++;
                                }
                                totalCount++;
                            });

                            const yesPercentage = ((yesCount / totalCount) * 100).toFixed(2);
                            const noPercentage = ((noCount / totalCount) * 100).toFixed(2);
                            const ehPercentage = ((ehCount / totalCount) * 100).toFixed(2);

                            const filteredVotes = getFilteredVotes(affairVote.councillorVotes);

                            return (
                                <div key={affairVote.id} className="flex flex-col items-center mb-8">
                                    <h3 className="text-xl font-bold mb-4">{affairVote.divisionText}</h3>
                                    <p>Nein bedeutet: {affairVote.meaningNo}<br />
                                    Ja bedeutet: {affairVote.meaningYes}
                                    </p>
                                    <div className="flex flex-row row-auto flex-wrap justify-evenly">
                                        {filteredVotes.map((vote) => {
                                            const backgroundColor = vote.decision === "Yes" ? "bg-green-200" : vote.decision === "No" ? "bg-red-200" : "bg-gray-200";
                                            return (
                                                <div key={vote.id} className={`flex flex-col items-center mb-4 p-4 border rounded shadow ${backgroundColor}`}>
                                                    <p className="text-xl font-semibold">{vote.firstName} {vote.lastName}</p>
                                                    <p className="text-lg">Entscheidung: {vote.decision}</p>
                                                    <p className="text-lg">Elan ID: {vote.elanId}</p>
                                                    <p className="text-lg">Nummer: {vote.number}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex flex-col items-center mt-8">
                                        <h4 className="text-lg font-bold">Stimmstatistik</h4>
                                        <p className="text-lg">Ja: {yesPercentage}% ({yesCount})</p>
                                        <p className="text-lg">Nein: {noPercentage}% ({noCount})</p>
                                        <p className="text-lg">Enthaltung: {ehPercentage}% ({ehCount})</p>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </main>
    );
}
