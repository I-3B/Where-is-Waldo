import './App.css';
import { useEffect, useState } from 'react';
import Header from './component/Header';
import Game from './component/Game';
import SelectLevel from './component/SelectLevel';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Leaderboard from './component/Leaderboard';
import uniqid from 'uniqid';
interface gameData {
    addedIn: number;
    gameStartedIn: number;
    gameEndedIn: number;
    difficulty: string;
}
function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [sessionID, setSessionID] = useState(uniqid());
    const [main, setMain] = useState(
        <SelectLevel onClick={levelSelected}></SelectLevel>
    );

    const [form, setForm] = useState(<></>);
    const [charactersNames, setCharactersNames] = useState(['empty']);
    const [difficulty, setDifficulty] = useState('non-selected');
    const [newFoundCharacter, setNewFoundCharacter] = useState('');
    const sessionsRef = firebase.firestore().collection('sessions');
    const thisSessionRef = sessionsRef.doc(sessionID);
    const leaderBoardRef = firebase.firestore().collection('leaderboard');
    function levelSelected(difficulty: string, characters: Array<string>) {
        setDifficulty(difficulty);
        setMain(
            <Game
                imageIsLoaded={imageIsLoadedAction}
                characters={characters}
                updateCharacters={updateCharactersCallback}
                gameOver={gameOverCallback}
            ></Game>
        );
        setCharactersNames(characters);
    }

    async function addSessionToDatabase() {
        thisSessionRef.set({
            addedIn: Date.now(),
            gameStartedIn: null,
            gameEndedIn: null,
            difficulty: null,
        });
    }
    async function imageIsLoadedAction() {
        setGameStarted(true);
        thisSessionRef.update({ gameStartedIn: Date.now() });
    }
    async function gameOverCallback() {
        setGameEnded(true);
        await thisSessionRef.update({ gameEndedIn: Date.now() });
        showForm();
    }

    async function clearIDS(ageInHours: number) {
        sessionsRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                let age = Date.now() - data.addedIn;
                let maxAge = ageInHours * 60 * 60 * 1000;
                if (age >= maxAge) doc.ref.delete();
            });
        });
    }

    async function updateCharactersCallback(character: string) {
        setNewFoundCharacter(character);
    }
    async function addToLeaderBoard(data: gameData, name: string) {
        if (data) {
            const duration = data.gameEndedIn - data.gameStartedIn;
            const recordedAt = data.gameEndedIn;
            const difficulty = data.difficulty;

            await leaderBoardRef.doc(difficulty).update({
                [name]: { duration, recordedAt, ID: sessionID },
            });
        } else alert("couldn't record result to leaderboard");
    }
    async function nameSubmitted(event: any) {
        event.preventDefault();
        let name: string = event.target?.querySelector('#name-input').value;
        name = name.trim();
        const submit = event.target?.querySelector('#submit-button');
        submit.disabled = true;
        if (event.target)
            await thisSessionRef.get().then(async (doc) => {
                if (doc.exists) {
                    let condition = await isNameUsedAlready(
                        name,
                        doc.data()?.difficulty
                    );
                    if (!condition) {
                        setForm(<></>);
                        setMain(<Leaderboard></Leaderboard>);
                        await addToLeaderBoard(doc.data() as gameData, name);
                        showLeaderBoard(doc.data()?.difficulty, name);
                    } else {
                        submit.disabled = false;
                        alert('This name is used already.');
                    }
                }
            });
    }
    async function isNameUsedAlready(name: string, difficulty: string) {
        let result = false;
        await leaderBoardRef
            .doc(difficulty)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    if ((doc.data() || {})[name]) {
                        result = true;
                    }
                }
            });
        return result;
    }
    async function showLeaderBoard(startIn: string, name: string) {
        let difficulties: any = {};
        await leaderBoardRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists) difficulties[doc.id] = doc.data();
            });
        });
        setMain(
            <Leaderboard
                data={difficulties}
                showTable={startIn}
                at={'#ID' + sessionID}
            ></Leaderboard>
        );
    }
    function showForm() {
        setForm(
            <form style={{ opacity: 0 }}>
                <div id="name-input-container">
                    <label>Your name:</label>
                    <input id="name-input"></input>
                </div>
                <input id="submit-button" type="submit"></input>
            </form>
        );
        setTimeout(() => {
            setForm(
                <form onSubmit={nameSubmitted} style={{ opacity: 1 }}>
                    <div id="name-input-container">
                        <label>Your name:</label>
                        <input id="name-input" required></input>
                    </div>
                    <input id="submit-button" type="submit"></input>
                </form>
            );
        }, 200);
    }
    useEffect(() => {
        //adding the session to the database
        addSessionToDatabase();
        //remove all session that are older than one day
        clearIDS(4);
    }, []);
    useEffect(() => {
        thisSessionRef.update({ difficulty: difficulty });
    }, [difficulty]);
    return (
        <div className="App">
            <Header
                foundCharacter={newFoundCharacter}
                gameStarted={gameStarted}
                characters={charactersNames}
                gameEnded={gameEnded}
                showLeaderBoard={() => {
                    setMain(<Leaderboard></Leaderboard>);
                    showLeaderBoard('Easy', '');
                    setGameEnded(true);
                }}
            ></Header>
            {form}
            {main}
        </div>
    );
}

export function HH_MM_SS(inSeconds: number) {
    let hours: any = Math.floor(inSeconds / 3600);
    let minutes: any = Math.floor((inSeconds - hours * 3600) / 60);
    let seconds: any = inSeconds - hours * 3600 - minutes * 60;
    seconds = Math.round(seconds * 100) / 100;
    if (hours < 10 && hours !== 0) {
        hours = '0' + hours + ':';
    } else if (hours === 0) hours = '';
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    return hours + '' + minutes + ':' + seconds;
}

export default App;
