import '../style/SelectLevel.css';
let levels = new Map();
levels.set('Easy', ['Kaonashi', 'Bowser', 'Packman']);
levels.set('Medium', ['Kaiman', 'Guts', 'Godzilla']);
levels.set('Hard', ['Jerry', 'Corvo Attano', 'Saitama']);
function SelectLevel(props: any) {
    function levelSelected(event: any) {
        if (event.target.id.includes('select')) {
            props.onClick(
                event.target.textContent,
                levels.get(event.target.textContent)
            );
        }
    }
    return (
        <div id="levels-container">
            <div id="SelectLevel" onClick={levelSelected}>
                <div id="select-easy">Easy</div>
                <div id="select-medium">Medium</div>
                <div id="select-hard">Hard</div>
            </div>
        </div>
    );
}
export default SelectLevel;
