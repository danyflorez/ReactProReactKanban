import React, { Component} from 'react';
import update from 'react-addons-update';
import {render} from 'react-dom';
import KanbanBoard from './KanbanBoard';
import 'babel-polyfill'

const API_URL = 'http://kanbanapi.pro-react.com';

const API_HEADERS = {
  'Content-Type' : 'application/json',
  Authorization: 'danyflorez@hotmail.es'
}

class KanbanBoardContainer extends Component{

  constructor(){
    super(...arguments);
    this.state = {
      cards: [],
    }
  }

  addTask(cardId, taskName){

    let prevState = this.state;

    let cardIndex = this.state.cards.findIndex((card) => card.id = cardId);

    let newTask = {id: Date.now(), name: taskName, done:false};

    let nextState = update(this.state.cards, {
      [cardIndex]:{
        tasks: {$push: [newTask]}
      }
    });

    this.setState({cards:nextState});

    fetch(`${API_URL}/cards/${cardId}/tasks`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newTask)
    })
    .then((response) => {
      if(response.ok){
        return response.json()
      } else {
        // Throw an error if server response wasn't 'ok'
        // so you can revert back the optimistic changes
        // made to the UI.
        throw new Error("Server response wasn't OK")
      }
    })
    .then((responseData) => {
      // When the server returns the definitive ID
      // used for the new Task on the server, update it on React
      newTask.id=responseData.id
      this.setState({cards:nextState});
    })
    .catch((error) => {
      this.setState(prevState);
    });

  }

  deleteTask(cardId, taskId, taskIndex){

    let prevState = this.state;

    let cardIndex = this.state.cards.findIndex((card) => card.id = cardId);
    let nextState = update(this.state.cards, {
                      [cardIndex]: {
                        tasks: {$splice: [[taskIndex, 1]]}
                      }
                   });
    this.setState({cards: nextState});

    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'delete',
      headers: API_HEADERS
    })
    .then((response) => {
      if(!response.ok){
        // Throw an error if server response wasn't 'ok'
        // so you can revert back the optimistic changes
        // made to the UI.
        throw new Error("Server response wasn't OK")
      }
    })
    .catch((error) => {
      console.error("Fetch error:",error)
      this.setState(prevState);
    });

  }

  toggleTask(cardId, taskId, taskIndex){


    let prevState = this.state;

    let cardIndex = this.state.cards.findIndex((card) => card.id = cardId);

    let newDoneValue;

    let nextState = update(this.state.cards,{
      [cardIndex]: {
        tasks: {
          [taskIndex]:{
            done: {$apply: (done) => {
              newDoneValue = !done
              return newDoneValue
            }}
          }
        }
      }
    });

    this.setState({cards:nextState});

    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
        method: 'put',
        headers: API_HEADERS,
        body: JSON.stringify({done:newDoneValue})
    })
    .then((response) => {
      if(!response.ok){
        // Throw an error if server response wasn't 'ok'
        // so you can revert back the optimistic changes
        // made to the UI.
        throw new Error("Server response wasn't OK")
      }
    })
    .catch((error) => {
      console.error("Fetch error:",error)
      this.setState(prevState);
    });

  }

  componentDidMount(){
    fetch(API_URL + '/cards', {headers: API_HEADERS})
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({cards:responseData});
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

  render(){
    return(
      <KanbanBoard cards={this.state.cards} taskCallbacks={{
                                                            toggle: this.toggleTask.bind(this),
                                                            delete: this.deleteTask.bind(this),
                                                            add: this.addTask.bind(this)
                                                          }}
      />
    )
  }
}

export default KanbanBoardContainer;
