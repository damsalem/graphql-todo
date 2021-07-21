import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";

const GET_TODOS = gql`
  query getToDos {
    todos {
      text
      id
      done
    }
  }
`;
const TOGGLE_TODO = gql`
  mutation toggleToDo($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        text
        id
        done
      }
    }
  }
`;
const ADD_TODO = gql`
  mutation addToDo($text: String!) {
    insert_todos(objects: { text: $text }) {
      returning {
        done
        id
        text
      }
    }
  }
`;
const DELETE_TODO = gql`
  mutation deleteToDo($id: uuid) {
    delete_todos(where: { id: { _eq: $id } }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

//list todos
//add todos
//toggle todos
//delete todos

function App() {
  const [todoText, setToDoText] = useState("");
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleToDo] = useMutation(TOGGLE_TODO);
  const [addToDo] = useMutation(ADD_TODO, {
    onCompleted: () => setToDoText(""),
  });
  const [deleteToDo] = useMutation(DELETE_TODO);

  async function handleToggleToDo({ id, done }) {
    const data = await toggleToDo({ variables: { id, done: !done } });
    console.log("toggled todo ", data);
  }

  async function handleAddTodo(event) {
    event.preventDefault();
    if (!todoText.trim()) return;
    const data = await addToDo({
      variables: { text: todoText },
      refetchQueries: [{ query: GET_TODOS }],
    });
    console.log("added todo ", data);
  }

  async function handleDeleteToDo({ id }) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this to do?"
    );
    if (isConfirmed) {
      const data = await deleteToDo({
        variables: { id },
        update: (cache) => {
          const prevData = cache.readQuery({ query: GET_TODOS });
          const newToDos = prevData.todos.filter((todo) => todo.id !== id);
          cache.writeQuery({ query: GET_TODOS, data: { todos: newToDos } });
        },
      });
      console.log("deleted todo ", data);
    }
  }

  if (loading) return <div>Loading To Dos..</div>;
  if (error) {
    console.log(data);
    return <div>Hmm... having some trouble grabbing those To Dos</div>;
  }
  return (
    <div className="vh-100 code flex flex-column items-center bg-gray white pa3">
      <h1 className="f2-l">
        To Dos&nbsp;
        <span role="img" aria-label="Checkmark">
          ✅
        </span>
      </h1>
      {/* {To Do Form} */}
      <form className="mb3" onSubmit={handleAddTodo}>
        <input
          className="pa2 f4 b--dashed"
          type="text"
          placeholder="Write your to do"
          onChange={(event) => setToDoText(event.target.value)}
          value={todoText}
        />
        <button className="pa2 f4 bg-green" type="submit">
          Create
        </button>
      </form>
      {/* {To Do List} */}
      <div className="flex items-center justify-center flex-column">
        <ul>
          {data.todos.map((todo) => (
            <li key={todo.id}>
              <p onDoubleClick={() => handleToggleToDo(todo)}>
                <span className={`pointer pa1 f3 ${todo.done && "strike"}`}>
                  {todo.text}
                </span>
                <button
                  className="bg-transparent bn f4 pointer"
                  onClick={() => handleDeleteToDo(todo)}
                >
                  <span className="red">&times;</span>
                </button>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
