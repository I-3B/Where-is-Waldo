import { useEffect } from 'react';
import { useState } from 'react';
import { HH_MM_SS } from '../App';
import '../style/Header.css';
function Header(props: any) {
    const [characters, setCharacters] = useState<JSX.Element[]>([]);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (props.characters && !props.characters.includes('empty')) {
            const charactersNames = props.characters;
            let characters: any = [];
            charactersNames.forEach((name: string) => {
                characters.push(
                    <figure
                        key={name + Date.now()}
                        className="character-preview"
                    >
                        <img
                            src={'assets/characters/' + name + '.png'}
                            alt={name}
                        ></img>
                        <figcaption>{name}</figcaption>
                    </figure>
                );
            });
            setCharacters(characters);
        }
    }, [JSON.stringify(props.characters)]);
    useEffect(() => {
        if (!props.gameEnded && props.gameStarted)
            setTimeout(() => {
                setTimer((timer) => timer + 1);
            }, 1000);
        else setTimer(-1);

        if (props.gameEnded) setCharacters([]);
    }, [props.gameStarted, props.gameEnded, timer]);
    useEffect(() => {
        const name = props.foundCharacter;
        const index = characters.findIndex((e) =>
            e.key ? e.key.toString().includes(name) : -1
        );
        if (index > -1) {
            characters[index] = (
                <figure
                    key={name + Date.now()}
                    className="character-preview found"
                >
                    <img
                        src={'assets/characters/' + name + '.png'}
                        alt={name}
                    ></img>
                    <figcaption>{name}</figcaption>
                </figure>
            );
        }
    }, [props.foundCharacter]);
    return (
        <header>
            <nav>
                <div>
                    <img
                        title="Retry"
                        src="assets/retry.png"
                        alt="Retry"
                        onClick={() => {
                            document.location.reload();
                        }}
                    ></img>
                </div>
                <div>
                    <img
                        title="Leaderboard"
                        src="assets/leaderboard.png"
                        alt="show leaderboard"
                        onClick={props.showLeaderBoard}
                    ></img>
                </div>
            </nav>
            <div id="timer">{timer > -1 ? HH_MM_SS(timer) : ''}</div>
            <div id="characters">{characters}</div>
        </header>
    );
}
export default Header;
