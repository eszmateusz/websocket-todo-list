import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [
      {name: 'Go shoping', id: 1}
    ],
    taskName: '',
  };

  componentDidMount() {
    this.socket = io.connect('localhost:8000');
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('updateData', (tasks) => this.updateTask(tasks));
    this.socket.on('removeTask', (id) => this.removeTask(id));
  };

  updateTask(tasks) {
    this.setState({
      tasks: [ ...tasks],
    });
  };

  removeTask(id, isLocal) {
    this.setState({
      tasks: this.state.tasks.filter((task) => task.id !== id),
    })
    if (isLocal === true) {
      this.socket.emit('removeTask', id);
    }
  };

  addTask(newTask) {
    this.setState({
      tasks: [...this.state.tasks, newTask]
    })
  };

  submitForm(event) {
    event.preventDefault();
    const newTask = {
      id: uuidv4(),
      name: this.state.taskName
    };
    this.addTask(newTask);
    this.socket.emit('addTask', (newTask));
    this.setState({ taskName: '' });
  };

  render() {
    const {tasks, taskName} = this.state;

    return (
      <div className="App">

        <header>
          <h1>ToDo-List | WebSocketApp</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className="task">
                {task.name}
                <button className="btn btn--red" onClick={() => this.removeTask(task.id, true)}>Remove</button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={(submit) => this.submitForm(submit)}>
            <input
              className="text-input" 
              autoComplete="off" 
              type="text" 
              required={true}
              placeholder="Type description here" 
              id="task-name" 
              value={taskName} 
              onChange={event => this.setState({taskName: event.target.value})} 
            />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;