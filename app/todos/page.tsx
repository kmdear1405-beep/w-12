"use client";

import { Toggle } from "@/components/tailgrids/core/toggle";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/tailgrids/core/native-select";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/tailgrids/core/table";
import { Pagination } from "@/components/tailgrids/core/pagination";
import { useEffect, useState } from "react";
import { Button } from "@/components/tailgrids/core/button";
import { Check, ClockThree, Plus, Trash1 } from "@tailgrids/icons";
import { Badge } from "@/components/tailgrids/core/badge";

import { Spinner } from "@/components/tailgrids/core/spinner";

import { fetchTodos } from "@/data/todo";
import { TodoType } from "@/data/todo";
import { todo } from "node:test";

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { TextArea } from "@/components/tailgrids/core/text-area";
import { TextField } from "@/components/tailgrids/core/text-field";
import next from "next";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";

export default function page() {
  const router = useRouter()
    useEffect(()=>checkLogin(router,'/todos'),[router])

  const [isLoading, setIsLoading] = useState(true);

  const [todosRaw, setTodosRaw] = useState<TodoType[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);

  const [onlyWaiting, setOnlyWaiting] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const [showDialog, setShowDialog] = useState<boolean>(false);

  useEffect(() => {
    const _todoRawStr = localStorage.getItem("todosRaw");
    if (_todoRawStr === null) {
      // setTodosRaw([]);
      fetchTodos()
      .then(data => setTodosRaw(data as TodoType[]))
      .catch(()=>setTodosRaw([]))
      .finally(()=>setIsLoading(false))



    } else {
      setTodosRaw(JSON.parse(_todoRawStr) as TodoType[]);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todosRaw", JSON.stringify(todosRaw));
  }, [todosRaw]);

  // onload
  // useEffect(() => {
  //   fetchTodos()
  //     .then((data) => {
  //       setTodosRaw(data as TodoType[]);
  //     })
  //     .catch((error) => {
  //       setTodosRaw([]);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }, []);

  // todosRaw,onlyWaiting => []=> todos
  useEffect(() => {
    // console.log(todosRaw);
    if (onlyWaiting) {
      setTodos(todosRaw.filter((todo) => todo.completed === false));
    } else {
      setTodos(todosRaw);
    }
  }, [todosRaw, onlyWaiting]);

  //todos , itemsPerPage => []=> totalPages
  useEffect(() => {
    //ตย.13/5 =2.6  ปัดขึ้น
    setTotalPages(Math.ceil(todos.length / itemsPerPage));
  }, [todos, itemsPerPage]);

  //totalPages =>[]=> currentPage
  useEffect(() => {
    if (totalPages > 0) {
      if (currentPage <= 0) setCurrentPage(1);
    } else if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  //delete todo
  const deleteTodo = (id: number) => {
    setTodosRaw(todosRaw.filter((todo) => todo.id !== id));
  };
  //make done
  const makeDone = (id: number) => {
    // console.log(`make todo done .... (${id})`);
    //[{1},{2},{3}] (delete 3)
    //      ^

    //pointer selected --> 3
    const selected = todosRaw.find((todo) => {
      return todo.id === id;
    });

    if (selected === null) return;

    //edit
    selected!.completed = true;
    console.log(selected);
    // update state
    setTodosRaw([...todosRaw]);
  };
  //add new todo
  const addTodo = () => {
    const idDom = document.getElementById("id") as HTMLInputElement;
    const titleDom = document.getElementById("title") as HTMLInputElement;

    const titleStr = titleDom.value.trim();
    if (titleStr === "") return;

    const newTodo: TodoType = {
      userId: 1,
      id: Number(idDom.value),
      title: titleDom.value.trim(),
      completed: false,
    };

    setTodosRaw([...todosRaw, newTodo]);
  };

  return (
    <>
      {/* // todo container */}
      <div className="mt-4 px-2 max-w-3xl mx-auto">
        {/* controller */}
        <div className="flex justify-between">
          {/* toggle */}
          <div className=" flex justify-between">
            <Toggle
              label="Show only"
              checked={onlyWaiting}
              onChange={(e) => setOnlyWaiting(e.target.checked)}
            />
            &nbsp;
            <Button
              className="h-8 p-2 bg-yellow-500 pointer-events-none mt-2"
              size="sm"
            >
              Waiting
              <ClockThree />
            </Button>
          </div>

          {/* dropdow */}
          <div className=" w-1/3">
            <NativeSelect
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <NativeSelectOption value="5">5 item per page</NativeSelectOption>
              <NativeSelectOption value="10">
                10 item per page
              </NativeSelectOption>
              <NativeSelectOption value="50">
                50 item per page
              </NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
        {/* table */}
        <div className=" mt-1">
          <TableRoot>
            <TableHeader>
              <TableRow className=" bg-black text-white">
                <TableHead className="w-24 font-bold text-right">ID</TableHead>
                <TableHead className="font-bold text-center">Title</TableHead>
                <TableHead className="font-bold flex justify-end items-center gap-2">
                  Completed
                  <Button
                    variant={"primary"}
                    className="h-8 p-2"
                    onClick={() => setShowDialog(true)}
                  >
                    <Plus />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* show spinner while loading */}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Spinner className="mx-auto" />
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && todos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className=" text-center text-red-500">
                    No data,may be connection refused(reload again)
                  </TableCell>
                </TableRow>
              )}
              {/* render data */}
              {todos
                .filter((todo, index) => {
                  const lower = (currentPage - 1) * itemsPerPage;
                  const upper = currentPage * itemsPerPage - 1;
                  return index >= lower && index <= upper;
                })

                .map((todo) => {
                  return (
                    <TableRow key={todo.id}>
                      <TableCell className="text-right">
                        <Badge
                          size={"lg"}
                          className="rounded-lg bg-gray-500 text-white font-bold"
                        >
                          {todo.id}
                        </Badge>
                      </TableCell>
                      <TableCell>{todo.title}</TableCell>
                      <TableCell className="flex justify-end gap-1">
                        {todo.completed ? (
                          <Button
                            size="sm"
                            className="h-8 bg-green-700 text-white pointer-events-none"
                          >
                            Done
                            <Check />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="h-8 bg-yellow-500 hover hover:bg-yellow-700"
                            onClick={() => makeDone(todo.id)}
                          >
                            Waiting
                            <ClockThree />
                          </Button>
                        )}

                        <Button
                          variant="danger"
                          className="h-8 p-2"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <Trash1 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {/* completed = false */}
              {/* <TableRow>
              <TableCell className="text-right">
                <Badge
                  size={"lg"}
                  className="rounded-lg bg-gray-500 text-white font-bold"
                >
                  1
                </Badge>
              </TableCell>
              <TableCell>Lorem ipsum dolor.</TableCell>
              <TableCell className="flex justify-end gap-1">
                <Button
                  size="sm"
                  className="h-8 bg-yellow-500 hover hover:bg-yellow-700"
                >
                  Waiting
                  <ClockThree />
                </Button>
                <Button variant="danger" className="h-8 p-2">
                  <Trash1 />
                </Button>
              </TableCell>
            </TableRow> */}
              {/* completed = true */}
              {/* <TableRow>
              <TableCell className="text-right">
                <Badge
                  size={"lg"}
                  className="rounded-lg bg-gray-500 text-white font-bold"
                >
                  2
                </Badge>
              </TableCell>
              <TableCell>Lorem ipsum dolor.</TableCell>
              <TableCell className="flex justify-end gap-1">
                <Button
                  size="sm"
                  className="h-8 bg-green-700 text-white pointer-events-none"
                >
                  Done
                  <Check />
                </Button>
                <Button variant="danger" className="h-8 p-2">
                  <Trash1 />
                </Button>
              </TableCell>
            </TableRow> */}

              {/* <TableRow>
              <TableCell className="text-right">
                <Badge
                  size={"lg"}
                  className="rounded-lg bg-gray-500 text-white font-bold"
                >
                  3
                </Badge>
              </TableCell>
              <TableCell>Lorem ipsum dolor.</TableCell>
              <TableCell className="flex justify-end gap-1">
                <Button
                  size="sm"
                  className="h-8 bg-green-700 text-white pointer-events-none"
                >
                  Done
                  <Check />
                </Button>
                <Button variant="danger" className="h-8 p-2">
                  <Trash1 />
                </Button>
              </TableCell>
            </TableRow> */}
            </TableBody>
          </TableRoot>
        </div>
        {todos.length > 0 && (
          <div className="mt-1 w1/3 mx-auto flex justify-center items-center gap-1">
            {/* pagination */}
            <Button
              appearance="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                sideLayout="icon"
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
            <Button
              appearance="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        )}
      </div>

      <Backdrop isOpen={showDialog} onOpenChange={setShowDialog}>
        <Dialog>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Plus className="bg-blue-100 rounded-md " size={32} />
              New todo
            </DialogTitle>
          </DialogHeader>

          <DialogBody>
            <form className="flex flex-col gap-4">
              <TextField className="flex flex-col gap-1.5">
                <Label className="font-bold">ID(auto)</Label>
                <Input
                  id="id"
                  className="w-full pointer-events-none bg-gray-100 text-gray-400"
                  value={
                    todosRaw.reduce((p, t) => (t.id > p ? t.id : p), 0) + 1
                  }
                />
              </TextField>

              <TextField className="flex flex-col gap-1.5">
                <Label className="font-bold">Title</Label>
                <Input
                  autoFocus
                  placeholder="ใส่งานที่ต้องการเพิ่ม"
                  className="w-full"
                  id="title"
                />
              </TextField>
            </form>
          </DialogBody>

          <DialogFooter>
            <DialogClose appearance="outline">Cancel</DialogClose>
            <DialogClose onClick={() => addTodo()}>Add todo</DialogClose>
          </DialogFooter>
        </Dialog>
      </Backdrop>
    </>
  );
}
