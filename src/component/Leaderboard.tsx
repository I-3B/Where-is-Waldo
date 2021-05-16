import { useEffect, useState } from 'react';
import '../style/Leaderboard.css';
import { HH_MM_SS } from '../App';
interface data {
    name: string;
    duration: number;
    recordedAt: number;
    rank: number;
}
function Leaderboard(props: any) {
    const [rows, setRows] = useState<JSX.Element[]>([]);
    function showDifficultyTable(difficulty: string, data: any) {
        if (Object.keys(data).length !== 0) {
            let dataArr: Array<data> = [];
            let rowsArr: Array<JSX.Element> = [];
            for (let i in data) {
                dataArr.push(Object.assign({ name: i }, data[i]));
            }
            dataArr.sort((a, b) => a.duration - b.duration);
            let itr = 1;
            dataArr.map((e) => Object.assign(e, { rank: itr++ }));
            dataArr.forEach((row) => {
                rowsArr.push(
                    <tr id={row.name + difficulty} key={row.name + difficulty}>
                        <td>{row.rank}</td>
                        <td>{row.name}</td>
                        <td>{HH_MM_SS(row.duration / 1000)}</td>
                        <td>{new Date(row.recordedAt).toUTCString()}</td>
                    </tr>
                );

                setRows(rowsArr);
            });
        } else {
            setRows([]);
        }
    }
    function changeTable(event: any) {
        const new_: Element = event.target;
        const old: Element | null = document.querySelector('.active-table');
        if (old) old.classList.remove('active-table');

        new_.classList.add('active-table');
        showDifficultyTable(
            new_.textContent || 'Easy',
            props.data[new_.textContent || 'Easy']
        );
    }

    useEffect(() => {
        document
            .querySelector('#' + props.showTable + '-table')
            ?.classList.add('active-table');
        const table = props.showTable || 'Easy';
        if (props.data) showDifficultyTable(table, props.data[table]);
        else setRows([<div key={'loading' + Math.random()}>Loading...</div>]);
    }, [props.at, props.data, props.showTable]);
    useEffect(() => {
        const playerRecord: Element = document.querySelector(props.at);

        if (playerRecord) {
            playerRecord.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
            playerRecord.setAttribute(
                'style',
                'background-color:#0874FA;color:black;'
            );
        }
    }, [JSON.stringify(rows)]);
    return (
        <div id="Leaderboard">
            <nav onClick={changeTable}>
                <div id="Easy-table">Easy</div>
                <div id="Medium-table">Medium</div>
                <div id="Hard-table">Hard</div>
            </nav>
            <table>
                <tbody>
                    <tr>
                        <th>rank</th>
                        <th>Name</th>
                        <th>Record</th>
                        <th>Date</th>
                    </tr>

                    {rows}
                </tbody>
            </table>
        </div>
    );
}
export default Leaderboard;
