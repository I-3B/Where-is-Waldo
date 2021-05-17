import '../style/Game.css';
import Dropdown from './Dropdown';
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
const playedBefore = !!localStorage.getItem('playedBefore');
localStorage.setItem('playedBefore', 'yes');
const IMAGE_NAME = 'building';
function Game(props: any) {
    const charactersDatabase = firebase
        .firestore()
        .collection(IMAGE_NAME)
        .doc('characters');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [charactersNames, setCharactersNames] = useState(props.characters);
    const [notification, setNotification] = useState(<></>);
    const [dropdownHandler, setDropdownHandler] = useState(<></>);

    function startGame(event: any) {
        setImageLoaded(true);
        setNotification(<></>);
        if (!playedBefore) {
            showNotification(
                'Find the characters who are displayed in the header in the shortest time possible.',
                '#0a7afa',
                5000
            );
        }
        event.target.style.opacity = '1';
        props.imageIsLoaded();
    }
    function newCoordinate(event: any) {
        const { pageX: x, pageY: y } = event;

        dropDownHere(x, y);
    }

    function getCoordinateFromPixels(x: number, y: number) {
        const img: any = document.querySelector('#game-image');
        if (img) {
            const [imgWidth, imgHeight] = [img.clientWidth, img.clientHeight];

            //dividing the click position on the image size to get responsive result for all devices
            return [
                Math.round(((x - img.offsetLeft) * 1000) / imgWidth),
                Math.round(((y - img.offsetTop) * 1000) / imgHeight),
            ];
        } else console.error('no game image');
        return [];
    }
    function dropDownHere(x: string, y: string) {
        setDropdownHandler(<></>);
        setTimeout(() => {
            setDropdownHandler(
                <Dropdown
                    choices={charactersNames}
                    x={x}
                    y={y}
                    onClick={dropdownClicked}
                ></Dropdown>
            );
        });
    }
    async function dropdownClicked(character: string, x: number, y: number) {
        showNotification('Checking...', '#F07626', -1);
        const [coordinateX, coordinateY] = getCoordinateFromPixels(x, y);
        if (coordinateX && coordinateY) {
            setDropdownHandler(<></>);
            let isCorrect;
            try {
                isCorrect = await matchCharacterWithCoords(
                    character,
                    coordinateX,
                    coordinateY
                );
            } catch (e) {
                alert('Check your internet connection, or open a VPN :)');
                console.error(e);
            }

            if (isCorrect !== undefined) {
                if (isCorrect) {
                    await showNotification('Correct!', 'yellowgreen', 950);
                    correctChoiceAction(character);
                    props.updateCharacters(character);
                } else {
                    await showNotification('Incorrect!', 'red', 950);
                }
            }
        }
    }
    async function correctChoiceAction(character: string) {
        setCharactersNames((names: string[]) => {
            let arr = [...names];
            if (arr.indexOf(character) > -1)
                arr.splice(arr.indexOf(character), 1);
            return arr;
        });
    }
    async function matchCharacterWithCoords(
        characterName: string,
        coordinateX: number,
        coordinateY: number
    ) {
        let result = false;
        await charactersDatabase.get().then((doc) => {
            let dataFound = false;
            if (doc.exists) {
                const characters = doc.data();
                if (characters)
                    if (characters[characterName]) {
                        dataFound = true;
                        let coordinates = characters[characterName];

                        if (
                            coordinateX >= coordinates.startX &&
                            coordinateX <= coordinates.endX &&
                            coordinateY >= coordinates.startY &&
                            coordinateY <= coordinates.endY
                        ) {
                            result = true;
                        }
                    }
            }
            if (!dataFound) console.error('characters data not found');
        });

        return result;
    }

    async function showNotification(
        message: string,
        color: string,
        time: number
    ) {
        setNotification(
            <div
                id="notification"
                style={{ backgroundColor: color, opacity: 0 }}
            >
                {message}
            </div>
        );

        setTimeout(() => {
            setNotification(
                <div
                    id="notification"
                    style={{ backgroundColor: color, opacity: 1 }}
                >
                    {message}
                </div>
            );
        });
        if (time > -1) {
            setTimeout(() => {
                setNotification(
                    <div
                        id="notification"
                        style={{ backgroundColor: color, opacity: 0 }}
                    >
                        {message}
                    </div>
                );
            }, time);
            setTimeout(() => {
                setNotification(<></>);
            }, time + 10);
        }
    }

    //for placing new characters
    //first click set the start position for x and y
    //second click set the star position for x and y
    function setCharacterHere(characterName: string, x: number, y: number) {
        charactersDatabase.get().then((doc) => {
            if (doc.exists) {
                const characters = doc.data();
                if (characters) {
                    if (!characters[characterName]) {
                        let map = { startX: x, startY: y };
                        characters[characterName] = map;
                        charactersDatabase.set(characters);
                    } else {
                        characters[characterName].endX = x;
                        characters[characterName].endY = y;
                        charactersDatabase.set(characters);
                    }
                }
            }
        });
    }
    function gameOver() {
        props.gameOver();
    }
    useEffect(() => {
        if (!imageLoaded) showNotification('Loading...', '#ffc802', -1);
    }, [imageLoaded]);
    useEffect(() => {
        if (charactersNames.length === 0) gameOver();
    }, [JSON.stringify(charactersNames)]);
    return (
        <div id="Game">
            {notification}
            {dropdownHandler}
            <img
                style={{ opacity: 0 }}
                onLoad={startGame}
                src="assets/building.jpg"
                id="game-image"
                onClick={newCoordinate}
                alt="building"
            ></img>
        </div>
    );
}
export default Game;
