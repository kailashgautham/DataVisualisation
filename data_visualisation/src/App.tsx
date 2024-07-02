import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Plotly from './Plotly';
import './App.css';
import CSVReader from 'react-csv-reader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const App: React.FC = () => {

  const [data, setData] = React.useState([]);
  const [emails, setEmails] = React.useState([]);

  const sendInvites = () => {
    fetch('http://localhost:3000/invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJyb2xlcyI6W3sicm9sZSI6MSwib3JnSWQiOiI2NjZiZTFmNjM2YmEwYzEwNzcyZGU1NTIiLCJwcm9qZWN0SWQiOiI2NjZiZTJhYzM2YmEwYzEwNzcyZGU1NTcifV0sImlhdCI6MTcxOTg4NTI4NywiZXhwIjoxNzE5ODg4ODg3fQ.KBfXTaN95hWs4L9vNcL3MZcu7eJ1tbBb-MrpeDbtTms'
      },
      body: JSON.stringify({ 
        assessmentId: "667d9d354b3625b6731b796a", 
        orgId: "667d9d354b3625b6731b796a", 
        projectId: "667d9d354b3625b6731b796a", 
        emails: emails,
        createdBy: "KailashGautham",
        validStartAt: "2021-10-01T00:00:00.000Z",
        validEndAt: "2021-10-01T00:00:00.000Z"
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  function BasicTable() {
    console.log(emails)
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {
                data[0] && Object.keys(data[0]).map((key) => (
                  <TableCell align="right" key={key}>{key}</TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow
                key={idx}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {
                row && Object.values(row).map((cell, idx) => (
                  <TableCell align="right" key={idx}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  const handleData = (data, fileInfo) => {
    setData(data);
    const newEmails = data.map((row) => row.email_id);
    setEmails(newEmails);
  }

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
  };

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>Data Visualization Demo</h1>
        </header>
        <main className="main-content">
          <Link to="/dashboard">D3.js</Link>
          <Link to="/plotly">Plotly</Link>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plotly" element={<Plotly />} />
          </Routes>
          <br></br>
          <CSVReader
            cssClass="react-csv-input"
            onFileLoaded={handleData}
            parserOptions={papaparseOptions}
          />
          <button onClick={sendInvites}>Send Invites</button>
          <BasicTable />
        </main>
      </div>
    </Router>
  );
};

export default App;
