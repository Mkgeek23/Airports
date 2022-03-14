import React, { Component } from 'react';
import Form from './components/Form';
import Result from './components/Result';
import './App.css';

interface HandleNameChangeInterface {
  target: HTMLInputElement;
}

export interface Props {
  airportA: string;
  airportB: string;
  changePortA: (event: HandleNameChangeInterface) => void;
  changePortB: (event: HandleNameChangeInterface) => void;
  submit?: (event: React.SyntheticEvent) => void;
}

interface Database {
  airports: Array<string>;
  connections: Array<Array<string>>;
}

interface Connection {
  start: string;
  end: string;
}

const database: Database = {
  airports: ['ATH', 'BSL', 'BFS', 'BLQ', 'BTS', 'BRS', 'CRL', 'BUD', 'DUB', 'EDI', 'EIN', 'GLA', 'HAM', 'CTA', 'KEF', 'CGN', 'SUF', 'LCA', 'LPL', 'LIS', 'LTN', 'STN', 'MAD'],
  connections: [['ATH', 'EDI'], ['ATH', 'GLA'], ['ATH', 'CTA'], ['BFS', 'CGN'], ['BFS', 'LTN'], ['BFS', 'CTA'], ['BTS', 'STN'],
  ['BTS', 'BLQ'], ['CRL', 'BLQ'], ['CRL', 'BSL'], ['CRL', 'LTN'], ['DUB', 'LCA'], ['LTN', 'DUB'], ['LTN', 'MAD'], ['LCA', 'HAM'],
  ['EIN', 'BUD'], ['EIN', 'MAD'], ['HAM', 'BRS'], ['KEF', 'LPL'], ['KEF', 'CGN'], ['SUF', 'LIS'], ['SUF', 'BUD'], ['SUF', 'STN'],
  ['STN', 'EIN'], ['STN', 'HAM'], ['STN', 'DUB'], ['STN', 'KEF']],
}

function processAirportConnection(connection: Connection): string {
  if (!database.airports.includes(connection.start) || !database.airports.includes(connection.end)) {
    return 'Brak połączeń';
  }

  const allConnections: Array<string> = findConnections(connection, [], 0);

  if (allConnections.length === 0) {
    return 'Brak połączeń';
  }

  const theShortestConnections: Array<string> = findTheShortestConnection(allConnections);
  let result = 'Najkrótsze połączenia to:';
  for (let i = 0; i < theShortestConnections.length; i++)
    result += ' [' + theShortestConnections[i] + ']';

  return result;
}

function findTheShortestConnection(array: Array<string>): Array<string> {
  let result: Array<string> = [];
  let min: number;
  if (array.length > 0) {
    min = array[0].length;
    for (let i = 0; i < array.length; i++) {
      if (array[i].length < min) min = array[i].length;
    }
    for (let i = 0; i < array.length; i++) {
      if (array[i].length === min) result.push(array[i]);
    }
  }
  return result;
}

function findConnections(connection: Connection, visited: Array<Array<string>>, index: number): Array<string> {
  let result: Array<string> = [''];

  if (visited.length > index) {
    for (let i = 0; i < visited[index].length; i++) {
      result[0] += visited[index][i] + ' - ';
    }
  }
  result[0] += connection.start;

  if (result[0] === connection.start) {
    result.pop();
  }

  for (let i = 0; i < database.connections.length; i++) {
    if (visited.length <= index) {
      let tmp: Array<string> = [];
      if (index !== 0) {
        for (let j = 0; j < visited[index - 1].length - 1; j++) {
          tmp.push(visited[index - 1][j]);
        }
      }
      visited.push(tmp);
    }

    if (visited.length > index && visited[index].includes(connection.start)) {
      visited[index].pop();
      return result;
    }

    if (connection.end === connection.start) {
      return result;
    }

    if ((connection.start === database.connections[i][0] || connection.start === database.connections[i][1])
      && !visited[index].includes(database.connections[i][0]) && !visited[index].includes(database.connections[i][1])) {
      visited[index].push(connection.start);
      index = visited.length;

      const newConnection: Connection = {
        start: '',
        end: connection.end,
      }

      newConnection.start = connection.start === database.connections[i][0] ? database.connections[i][1] : database.connections[i][0];

      const tmp: Array<string> = findConnections(newConnection, visited, index - 1);

      index = visited.length;

      if (tmp != null && tmp.length > 0) {
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i].substring(tmp[i].length - 3) === connection.end) {
            result.push(tmp[i]);
          }
        }
      }
    }
  }
  return result;
}

class App extends Component {
  state = {
    airportA: '',
    airportB: '',
    connections: '',
  }

  handlePortAChange = (event: HandleNameChangeInterface) => {
    this.setState({
      airportA: event.target.value,
    })
  }

  handlePortBChange = (event: HandleNameChangeInterface) => {
    this.setState({
      airportB: event.target.value,
    })
  }

  handleAirportsSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const connection: Connection = {
      start: this.state.airportA.toUpperCase(),
      end: this.state.airportB.toUpperCase(),
    }
    this.setState({
      connections: processAirportConnection(connection),
    })
  }

  render() {
    return (
      <div className="App">
        Dostępne lotniska: <br />
        {database.airports + ' '}
        <Form airportA={this.state.airportA}
          airportB={this.state.airportB}
          changePortA={this.handlePortAChange}
          changePortB={this.handlePortBChange} submit={this.handleAirportsSubmit} />
        <Result value={this.state.connections} />
      </div>
    );
  }
}

export default App;
