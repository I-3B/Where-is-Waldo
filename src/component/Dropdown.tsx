import '../style/Dropdown.css';
function Dropdown(props: any) {
    const choicesText = [...props.choices];
    let choices: any = [];
    choicesText.forEach((text) =>
        choices.push(
            <div key={text} className="choice">
                {text}
            </div>
        )
    );
    function sendCharacterName(event: any) {
        if (event.target.className.includes('choice'))
            props.onClick(event.target.textContent, props.x, props.y);
    }
    return (
        <div
            onClick={sendCharacterName}
            style={{ top: props.y + 'px', left: props.x + 'px' }}
            id="Dropdown"
        >
            {choices}
        </div>
    );
}
export default Dropdown;
