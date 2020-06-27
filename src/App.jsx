import React, {
    useState,
    useRef,
    useEffect, useCallback
} from 'react';
import './App.css';
import {createSet, createAdd, createRemove, createToggle} from "./actions"

let idSeq = Date.now();
const todo_key = '_$_todo';

function bindActionCreators(actionCreators, dispatch) {
    const ret = {};
    for(let key in actionCreators){
        ret[key] = function (...args) {
            const actionCreator = actionCreators[key];
            const action = actionCreator(...args);
            dispatch(action);
        }
    }
    return ret;
}

const Control = React.memo((props)=>{
    const {addTodo} = props;
    const inputRef = useRef();
    const onSubmit = (e)=>{
        e.preventDefault();
        const newText = inputRef.current.value.trim();
        if(newText.length===0){
            return;
        }


        addTodo({
            id: idSeq++,
            text: newText,
            complete: false
        });
        inputRef.current.value = '';

    }
    return (
        <div>
            <h1>todos</h1>
            <form onSubmit={onSubmit}>
                <input
                    className="item-input"
                    type="text"
                    ref={inputRef}
                    placeholder="What needs to be done?"
                />
            </form>
        </div>
    )
});

const TodoItem = React.memo((props) => {
    const {todo, toggleTodo, removeTodo} = props;
    const onChange = ()=>{
        toggleTodo(todo.id);
    };
    const onRemove = ()=>{
        removeTodo(todo.id);
    };
    return (
        <li className="todo-item">
            <input type="checkbox" onChange={onChange} checked={todo.complete}/>
            <span className={todo.complete ? 'complete' : ''}>{todo.text}</span>
            <button onClick={onRemove}>&#xd7;</button>
        </li>
    )
});

const Todos = React.memo((props) => {
    const {todos, removeTodo, toggleTodo} = props;
    console.log("Todos");
    return (
        <ul>
            {
                todos.map(todo=>{
                    return (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            removeTodo={removeTodo}
                            toggleTodo={toggleTodo}/>
                    )
                })
            }
        </ul>
    )
});

const TodoList = (props) => {
    const [todos, setTodos] = useState([]);
    const [count, setCount] = useState(0);
    const dispatch = useCallback((action)=>{
        const {type, payload} = action;
        switch (type) {
            case 'set':
                setTodos(payload);
                break;
            case 'add':
                setTodos(todos=>[...todos, payload]);
                break;
            case 'remove':
                setTodos(todos => todos.filter(item=>item.id != payload));
                break;
            case 'toggle':
                setTodos(todos => todos.map(todo=>{
                    return todo.id === payload
                        ? {...todo, complete: !todo.complete}
                        : todo;
                }));
                break;
            default:
        }
    }, []);

    useEffect(()=>{
        dispatch({type: 'set', payload: JSON.parse(localStorage.getItem(todo_key)||[])})
    }, [])

    useEffect(()=>{
        localStorage.setItem(todo_key, JSON.stringify(todos))
    }, [todos])


    return (
        <div className="wrap">
            <div>
                <button onClick={()=>{setCount(count=>count+1)}}>点我</button><p>{count}</p>
            </div>
            <div className="todo-list">
                <Control
                    {
                        ...bindActionCreators({
                            addTodo: createAdd
                        }, dispatch)
                    }
                />
                <Todos todos={todos}
                   {
                       ...bindActionCreators({
                           removeTodo: createRemove,
                           toggleTodo: createToggle
                       }, dispatch)
                   }
                />
            </div>
        </div>
    )
};





export default TodoList;
