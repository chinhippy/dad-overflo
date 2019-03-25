import React, { Component } from "react";
import "./style.css";
import API from "../../services/APIService";
import { Collection } from "../Collection";
// import { listOfTodos } from './ListOfTodos'
import { TextArea } from "../TextArea";
import GridWrapper from "../GridWrapper";
import GridItem from "../GridItem";
import FirebaseContext from "../Firebase/context";

export class CollectionWrapper extends Component {
  state = {
    listOfTodos: [],
    task: "",
    deletedTask: [],
    error: ""
  };

  componentDidMount() {
    this.getTasks();
    var elems = document.querySelectorAll('.tooltipped');

    window.M.Tooltip.init(elems)
  }

  getTasks = () => {
    API.getTasks(this.firebase.dbUserInfo).then(res =>
      this.setState({ listOfTodos: res.data })
    );
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    console.log('value',value);
    console.log('name',name);
    console.log(e.target)
    this.setState({
     [name]: value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const newTask = {
      isComplete: false,
      body: this.state.task
    };
    API.createATask(this.firebase.dbUserInfo._id, newTask).then(res => {
      if (res.data.errors) {
        this.setState({ error: res.data.errors.body.message });
      } else {
        this.setState({
          listOfTodos: this.state.listOfTodos.concat(newTask),
          error: "",
          task: "",
        });
      }
      // this.setState({error: err.errors.body.message})
    });
  };

  handleTaskComplete = (isComplete, id) => {
    console.log("clicked");
    const taskId = id;
    const userId = this.firebase.dbUserInfo._id;
    // isComplete is a boolean, whichever is current at that time send it
    const taskComplete = isComplete;
    // send object with either true or false
    const task = {
      isComplete: !taskComplete
    };
    API.updateOneTask(userId, taskId, task)
      .then(() => {
        API.getTasks().then(res => this.setState({ listOfTodos: res.data }));
      })
      .catch(err => console.log(err));
  };

  handleTaskDelete = id => {
    const taskId = id;
    const userId = this.firebase.dbUserInfo._id;

    API.deleteOneTask(userId, taskId)
      .then(() => {
        API.getTasks().then(res => this.setState({ listOfTodos: res.data }));
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => {
          this.firebase = firebase;

          return (
            <div className="container">
              <div className="row">
                <div className="col l6">
                  {/* render if isComplete is true */}

                  <GridWrapper statusTitle={"Incomplete"}>
                    {this.state.listOfTodos.map(
                      item =>
                        !item.isComplete && (
                          <GridItem
                            boxColor={"incomplete-color"}
                            key={item._id}
                            id={item._id}
                            taskId={item._id}
                            // pass a reference to the function and pass in the arguments - much better than using the target object
                            handleTaskComplete={() =>
                              this.handleTaskComplete(item.isComplete, item._id)
                            }
                            handleTaskDelete={() =>
                              this.handleTaskDelete(item._id)
                            }
                            body={item.body}
                            isComplete={item.isComplete}
                            leftIcon={'fas fa-check fa-2x'}
                            rightIcon={'fas fa-trash-alt fa-2x'}
                          />
                        )
                    )}
                  </GridWrapper>
                </div>

                <div className="col l6">
                  {/* render if isComplete is true */}
                  <GridWrapper statusTitle={"Complete"}>
                    {this.state.listOfTodos.map(
                      item =>
                        item.isComplete && (
                          <GridItem
                            boxColor={"complete-color"}
                            key={item._id}
                            id={item._id}
                            body={item.body}
                            isComplete={item.isComplete}
                            handleTaskComplete={() =>
                              this.handleTaskComplete(item.isComplete, item._id)
                            }
                            handleTaskDelete={() =>
                              this.handleTaskDelete(item._id)
                            }
                            leftIcon={'fas fa-history fa-2x'}
                            rightIcon={'fas fa-trash-alt fa-2x'}
                          />
                        )
                    )}
                  </GridWrapper>
                </div>

                <div className="col l12">
                  <TextArea
                    error={this.state.error}
                    value={this.state.task}
                    name="task"
                    handleInputChange={this.handleInputChange}
                    handleFormSubmit={this.handleFormSubmit}
                  />
                </div>
              </div>
            </div>
          );
        }}
      </FirebaseContext.Consumer>
    );
  }
}
