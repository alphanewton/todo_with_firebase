"use client";
import { AiOutlinePlus } from "react-icons/ai";
import { useEffect, useState } from "react";
import Todo from "./Todo";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const style = {
  bg: `h-screen w-screen p-5 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-purple-500 text-slate-100`,
  count: `text-center p-2`,
};

export default function Home() {
  const [todos, setTodos] = useState<any[]>();
  const [input, setInput] = useState("");

  //Create todo
  const createTodo = async (e: any) => {
    e.preventDefault();
    if (input === "") {
      alert("Please enter a valid todo");
      return;
    } else {
      await addDoc(collection(db, "todos"), {
        text: input,
        completed: false,
      });

      setInput("");
    }
  };

  //Read todo
  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr: any = [];
      querySnapshot.forEach((doc) =>
        todosArr.push({ ...doc.data(), id: doc.id })
      );
      setTodos(todosArr);
    });

    return () => unsubscribe();
  }, []);

  //Update todo
  const toggleComplete = async (todo: any) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    });
  };

  //Delete todo
  const deleteTodo = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
  };
  return (
    <main>
      <div className={style.bg}>
        <div className={style.container}>
          <h3 className={style.heading}>Todo App</h3>
          <form className={style.form} onSubmit={createTodo}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              className={style.input}
              placeholder="Add Todo"
            />
            <button className={style.button} type="submit">
              <AiOutlinePlus size={30} />
            </button>
          </form>
          <ul>
            {todos &&
              todos.map((todo, index) => (
                <Todo
                  key={index}
                  todo={todo}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                />
              ))}
          </ul>
          {todos?.length && (
            <p className={style.count}>{`You have ${todos?.length} todos`}</p>
          )}
        </div>
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic";
