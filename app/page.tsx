"use client";
import useMainContext, { MainContextProvider } from "@/context/mainContext";
import {
  TrashIcon,
  Bars3Icon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <MainContextProvider>
      <Navbar />
      <main className="px-6 py-4">
        <ItemsPossibleList />
      </main>
    </MainContextProvider>
  );
}

function Navbar() {
  return (
    <div className="navbar bg-base-100 pr-6">
      <div className="flex-1">
        <p className="btn-ghost btn text-xl normal-case">
          Little Alchemy 2 Solver
        </p>
      </div>
      <div className="navbar-end hidden gap-4 md:flex">
        <AddItemsInputBox />
        <ClearItems />
      </div>
      <MobileNavbarActions />
    </div>
  );
}

function AddItemsInputBox() {
  const {
    state: { allItems, availableItems },
    dispatch,
  } = useMainContext();
  const [value, setValue] = useState("");
  // TODO: Optimize if possible
  const addItem = () => {
    if (validateItem()) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          item: value,
        },
      });
      setValue("");
    }
  };
  const validateItem = () => {
    return allItems.includes(value) && !availableItems.has(value);
  };
  return (
    <div className="form-control flex flex-none flex-row gap-2">
      <input
        type="text"
        placeholder="Add Item e.g. Fire"
        className="input-bordered input"
        id="available-item"
        list="available-items"
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addItem();
          }
        }}
      />
      <button
        className="btn-outline btn-primary btn"
        disabled={!validateItem()}
      >
        <PlusCircleIcon className="h-5 w-5" />
        <span>Add</span>
      </button>
      <datalist id="available-items">
        {allItems
          .filter((e) => !availableItems.has(e))
          .map((item) => (
            <option key={item} value={item} />
          ))}
      </datalist>
    </div>
  );
}

function ClearItems() {
  const { dispatch } = useMainContext();
  return (
    <button
      className="btn-outline btn-error btn"
      onClick={() => {
        dispatch({
          type: "CLEAR_ITEMS",
          payload: {},
        });
      }}
    >
      <TrashIcon className="h-5 w-5" />
      <span>Clear Items</span>
    </button>
  );
}

function MobileNavbarActions() {
  return (
    <div className="navbar-end flex md:hidden">
      <label
        htmlFor="mobile-navbar-action"
        className="btn-outline btn-primary btn"
      >
        <Bars3Icon
          className="h-5 w-5"
          title="Action e.g. add items, clear items, etc..."
        />
      </label>
      <input
        type="checkbox"
        id="mobile-navbar-action"
        className="modal-toggle"
      />
      <label htmlFor="mobile-navbar-action" className="modal cursor-pointer">
        <label htmlFor="" className="modal-box relative flex flex-col gap-4">
          <AddItemsInputBox />
          <ClearItems />
        </label>
      </label>
    </div>
  );
}

function ItemsPossibleList() {
  const [itemsMap, setItemsMap] = useState<{
    [key: string]: [string, string][];
  }>({});
  useEffect(() => {
    const controller = new AbortController();
    async function loadMap() {
      const res = await fetch("/items-map.json", {
        signal: controller.signal,
      });
      const data = await res.json();
      setItemsMap(data);
    }
    loadMap();
    return () => {
      controller.abort();
    };
  }, []);
  const { availableItems } = useMainContext().state;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Object.entries(itemsMap)
        .filter(
          ([key, itemsList]) =>
            itemsList.some(
              ([item1, item2]) =>
                availableItems.has(item1) && availableItems.has(item2)
            ) && !availableItems.has(key)
        )
        .map(([key, items]) => (
          <ItemsPossibleCard key={key} items={items} product={key} />
        ))}
    </div>
  );
}

// TODO: Optimize if possible
function ItemsPossibleCard({
  items,
  product,
}: {
  items: [string, string][];
  product: string;
}) {
  const {
    state: { availableItems },
    dispatch,
  } = useMainContext();
  const [item1, item2] = items.find(
    ([a, b]) => availableItems.has(a) && availableItems.has(b)
  ) as [string, string];
  return (
    <div className="card compact bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="card rounded-box grid h-20 place-items-center bg-base-300">
          <h2 className="card-title">{product}</h2>
        </div>
        <div className="flex w-full">
          <div className="card rounded-box grid h-20 flex-grow place-items-center bg-base-300">
            {item1}
          </div>
          <div className="divider divider-horizontal">&</div>
          <div className="card rounded-box grid h-20 flex-grow place-items-center bg-base-300">
            {item2}
          </div>
        </div>
      </div>
      <div className="card-actions justify-end">
        <button
          className="btn-primary btn flex gap-2"
          onClick={() =>
            dispatch({
              type: "ADD_ITEM",
              payload: {
                item: product,
              },
            })
          }
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span>Add to list</span>
        </button>
      </div>
    </div>
  );
}
