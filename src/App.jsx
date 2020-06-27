import React, {
    useState,
    createContext,
    useContext,
    useMemo,
    useCallback,
    PureComponent,
    useRef,
    useEffect
} from 'react';
import './App.css';

let idSeq = Date.now();
const todo_key = '_$_todo'

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
})

const TodoItem = React.memo((props) => {
    const {todo, removeTodo, toggleTodo} = props;
    const onChange = ()=>{
        toggleTodo(todo.id);
    }
    const onRemove = ()=>{
        removeTodo(todo.id);
    }
    return (
        <li className="todo-item">
            <input type="checkbox" onChange={onChange} checked={todo.complete}/>
            <span className={todo.complete ? 'complete' : ''}>{todo.text}</span>
            <button onClick={onRemove}>&#xd7;</button>
        </li>
    )
})

const Todos = React.memo((props) => {
    const {todos, removeTodo, toggleTodo} = props;
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
})

const TodoList = (props) => {
    const [todos, setTodos] = useState([]);

    useEffect(()=>{
        setTodos(todos=>JSON.parse(localStorage.getItem(todo_key)||[]))
    }, [])

    useEffect(()=>{
        localStorage.setItem(todo_key, JSON.stringify(todos))
    }, [todos])

    const addTodo = (todo) => {
        setTodos(todos => [...todos, todo])
    }

    const removeTodo = (id) => {
        setTodos(todos => todos.filter(item=>item.id!=id))
    }

    const toggleTodo = (id) => {
        setTodos(todos => todos.map(todo=>{
            return todo.id === id
            ? {...todo, complete: !todo.complete}
            : todo;
        }))
    }

    return (
        <div className="wrap">
            <div className="todo-list">
                <Control addTodo={addTodo}/>
                <Todos todos={todos} removeTodo={removeTodo} toggleTodo={toggleTodo}/>
            </div>
        </div>
    )
}





export default TodoList;
