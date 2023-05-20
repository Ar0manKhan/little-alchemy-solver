"use client";
import useMainContext, { MainContextProvider } from "@/context/mainContext";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <MainContextProvider>
      <Navbar />
      <main className="p-4 pl-6 pr-2">
        <ItemsPossibleList />
      </main>
    </MainContextProvider>
  );
}

function Navbar() {
  const {
    state: { allItems, availableItems },
    dispatch,
  } = useMainContext();
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <p className="btn-ghost btn text-xl normal-case">
          Little Alchemy 2 Solver
        </p>
      </div>
      <div className="navbar-end flex gap-2">
        <div className="form-control flex-none gap-2">
          <input
            type="text"
            placeholder="Add Item e.g. Fire"
            className="input-bordered input"
            id="available-item"
            list="available-items"
            autoComplete="off"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = e.currentTarget.value;
                if (allItems.includes(val) && !availableItems.has(val)) {
                  dispatch({
                    type: "ADD_ITEM",
                    payload: {
                      item: e.currentTarget.value,
                    },
                  });
                  e.currentTarget.value = "";
                }
              }
            }}
          />
          <datalist id="available-items">
            {allItems
              .filter((e) => !availableItems.has(e))
              .map((item) => (
                <option key={item} value={item} />
              ))}
          </datalist>
        </div>
        <ClearItems />
      </div>
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

function ItemsPossibleList() {
  const [itemsMap, setItemsMap] = useState<{ [key: string]: [string, string] }>(
    {}
  );
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
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Object.entries(itemsMap)
        .filter(
          ([key, [item1, item2]]) =>
            availableItems.has(item1) && availableItems.has(item2)
        )
        .map(([key, [item1, item2]]) => (
          <ItemsPossibleCard
            key={key}
            item1={item1}
            item2={item2}
            product={key}
          />
        ))}
    </div>
  );
}

function ItemsPossibleCard({
  item1,
  item2,
  product,
}: {
  item1: string;
  item2: string;
  product: string;
}) {
  return (
    <div className="side card compact bg-base-100 shadow-lg">
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
        <button className="btn-primary btn">Add to list</button>
      </div>
    </div>
  );
}
