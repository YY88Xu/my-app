import React, {
    useState,
    useRef,
    useEffect
} from 'react';
import './App.css';

let idSeq = Date.now();
const todo_key = '_$_todo';

const Control = React.memo((props)=>{
    const {dispatch} = props;
    const inputRef = useRef();
    const onSubmit = (e)=>{
        e.preventDefault();
        const newText = inputRef.current.value.trim();
        if(newText.length===0){
            return;
        }

        dispatch({type: 'add', payload: {
                id: idSeq++,
                text: newText,
                complete: false
            }});

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
    const {todo, dispatch} = props;
    const onChange = ()=>{
        dispatch({type: 'toggle', payload: todo.id});
    };
    const onRemove = ()=>{
        dispatch({type: 'remove', payload: todo.id});
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
    const {todos, dispatch} = props;
    return (
        <ul>
            {
                todos.map(todo=>{
                    return (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            dispatch={dispatch}/>
                    )
                })
            }
        </ul>
    )
});

const TodoList = (props) => {
    const [todos, setTodos] = useState([]);

    const dispatch =(action)=>{
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
    };

    useEffect(()=>{
        dispatch({type: 'set', payload: JSON.parse(localStorage.getItem(todo_key)||[])})
    }, [])

    useEffect(()=>{
        localStorage.setItem(todo_key, JSON.stringify(todos))
    }, [todos])


    return (
        <div className="wrap">
            <div className="todo-list">
                <Control dispatch={dispatch}/>
                <Todos todos={todos} dispatch={dispatch}/>
            </div>
        </div>
    )
}





export default TodoList;
