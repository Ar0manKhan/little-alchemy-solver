"use client";
import useMainContext, { MainContextProvider } from "@/context/mainContext";

export default function Home() {
  return (
    <MainContextProvider>
      <main className="">
        <Navbar />
        <Text />
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
    </div>
  );
}

function Text() {
  const { availableItems } = useMainContext().state;
  return (
    <div>
      <p>{availableItems.size}</p>
      <p>{Array.from(availableItems).join(", ")}</p>
    </div>
  );
}
