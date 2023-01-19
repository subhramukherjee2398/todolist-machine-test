import React, { useEffect, useState } from "react";
import axios from "axios";

const Todolist = () => {
  const [todo, setTodo] = useState("");
  const [todolist, setTodolist] = useState([]);
  const [updateItem, setUpdateItem] = useState();
  const [toogle, setToogle] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3006/todolist")
      .then((res) => {
        console.log("res", res.data);
        setTodolist(res.data);
      })
      .catch((e) => {
        console.warn(e);
      });
  }, []);

  const saveData = (data) => {
    axios
      .post("http://localhost:3006/todolist", data)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateData = (data) => {
    console.warn(data)
    axios
      .put(`http://localhost:3006/todolist/${data.id}`, data)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleAdd = () => {
    if (todo && !toogle) {
      saveData({ id: new Date().toUTCString(), todo });
      setTodolist([...todolist, { id: new Date().toUTCString(), todo }]);
      setTodo("");
    } else if (toogle) {
      let uData = todolist.map((e) => {
        if (e.id === updateItem) {
          let id = new Date().toUTCString();
          return { ...e, id, todo };
          
        } else {
          return e;
        }
      });
      updateData({ id: updateItem, todo });
      setTodolist(uData);
      setTodo("");
      setToogle(false);
    }
  };

  const deleteDataFromjson = (id) => {
    axios.delete(`http://localhost:3006/todolist/${id}`);
  };

  const deleteTodo = (id) => {
    deleteDataFromjson(id);
    let newTodoList = todolist.filter((ele) => {
      return ele.id !== id;
    });
    setTodolist(newTodoList);
  };

  const update = (id) => {
    let uItem = todolist.find((e) => {
      return e.id === id;
    });
    console.log(uItem.id);
    setUpdateItem(uItem.id);
    setToogle(true);
    setTodo(uItem.todo);
  };

  return (
    <div>
      <div>
        <h4> {!toogle ? "ADD" : "Update"} Your Todo</h4>
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
      </div>
      <div>
        <button onClick={() => handleAdd()}>
          {!toogle ? "ADD" : "Update"}
        </button>
      </div>
      <div>
        <h2>{todolist.length > 0 && "Your Todo List"}</h2>
        {console.log(todolist)}
        {todolist &&
          todolist.map((ele) => (
            <div key={ele.id} className='todo-container'>
              <button className="todo">{ele.id}</button>
              <button className="time">{ele.todo}</button>
              <button onClick={() => deleteTodo(ele.id)} className='remove'>remove</button>
              <button onClick={() => update(ele.id)} className='update'>update</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Todolist;
