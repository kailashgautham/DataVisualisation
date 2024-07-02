import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

interface NumCandidates {
    total: number;
    notVisited: number;
    notAttempted: number;
    attempting: number;
    cheatingDetectedFail: number;
    cheatingDetectedPass: number;
    failed: number;
    passed: number;
}

interface FiveNumberSummary {
    mean: number;
    stdDev: number;
    lowest: number;
    lowerQuartile: number;
    median: number;
    upperQuartile: number;
    highest: number;
}

const Plotly: React.FC = () => {
    const [data, setData] = useState<NumCandidates>({
        total: 0,
        notVisited: 0,
        notAttempted: 0,
        attempting: 0,
        cheatingDetectedFail: 0,
        cheatingDetectedPass: 0,
        failed: 0,
        passed: 0
    });

    const [fiveNumberSummary, setFiveNumberSummary] = useState<FiveNumberSummary | null>(null);

    const handleClick = () => {
        const newData: NumCandidates = {
            total: 100,
            notVisited: 10,
            notAttempted: 20,
            attempting: 30,
            failed: 16,
            passed: 24,
            cheatingDetectedFail: 10,
            cheatingDetectedPass: 5,
        };
        setData(newData);

        const newSummary = {
            mean: 50,
            stdDev: 15,
            lowest: 20,
            lowerQuartile: 40,
            median: 53,
            upperQuartile: 76,
            highest: 85
        };
        setFiveNumberSummary(newSummary);

    };

    const pieChart = (
        <Plot
            data={[
                {
                    type: 'sunburst',
                    labels: [
                        'Total',
                        'Not Visited',
                        'Not Attempted',
                        'Attempting',
                        'Failed',
                        'Passed',
                        'Cheating Detected Fail',
                        'Cheating Detected Pass',
                        'Non-cheating Fail',
                        'Non-cheating Pass'
                    ],
                    parents: [
                        '',
                        'Total',
                        'Total',
                        'Total',
                        'Total',
                        'Total',
                        'Failed',
                        'Passed',
                        'Failed',
                        'Passed'
                    ],
                    values: [
                        data.total,
                        data.notVisited,
                        data.notAttempted,
                        data.attempting,
                        data.failed,
                        data.passed,
                        data.cheatingDetectedFail,
                        data.cheatingDetectedPass,
                        data.failed - data.cheatingDetectedFail,
                        data.passed - data.cheatingDetectedPass
                    ],
                    branchvalues: 'total',
                    marker: {
                        colors: [
                            '#636efa', '#EF553B', '#00cc96', '#ab63fa',
                            '#19d3f3', '#e763fa', '#FECB52', '#FFA15A',
                            '#FF6692', '#B6E880'
                        ]
                    },
                    maxdepth: 3
                }
            ]}
            layout={{
                width: 600,
                height: 600,
                margin: { l: 0, r: 0, b: 0, t: 0 },
                sunburstcolorway: [
                    '#636efa', '#EF553B', '#00cc96', '#ab63fa', '#19d3f3', '#e763fa', '#FECB52', '#FFA15A'
                ],
                extendsunburstcolorway: true,
                title: 'Candidates Status',
            }}
        />
    );



    const boxPlot = (
        fiveNumberSummary && (
            <Plot
                data={[
                    {
                        type: 'box',
                        y: [
                            fiveNumberSummary.lowest,
                            fiveNumberSummary.lowerQuartile,
                            fiveNumberSummary.median,
                            fiveNumberSummary.upperQuartile,
                            fiveNumberSummary.highest
                        ],
                        boxpoints: 'all',
                        jitter: 0.3,
                        pointpos: -1.8,
                        marker: { color: '#3D9970' },
                        line: { width: 1 }
                    }
                ]}
                layout={{
                    width: 500,
                    height: 500,
                    title: 'Five Number Summary',
                    yaxis: {
                        title: 'Scores',
                        zeroline: false
                    }
                }}
            />
        )
    );

    return (
        <div className="app-container">
            <main className="main-content">
                <button className="render-button" onClick={handleClick}>Render Data</button>
                <div id="chart-container">
                    {pieChart}
                </div>
                <br></br><br></br>
                <div>
                    {boxPlot}
                </div>
            </main>
        </div>
    );
};

export default Plotly;
