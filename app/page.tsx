"use client";
import useMainContext, { MainContextProvider } from "@/context/mainContext";

export default function Home() {
  const { state } = useMainContext();
  return (
    <MainContextProvider>
      <main className="">
        <Navbar />
        <p>{Array.from(state.availableItems).join(", ")}</p>
      </main>
    </MainContextProvider>
  );
}

function Navbar() {
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
        />
        <datalist id="available-items">
          <option value="Fire" />
          <option value="Water" />
          <option value="Earth" />
          <option value="Air" />
          <option value="Pressure" />
          <option value="Energy" />
          <option value="Dust" />
          <option value="Lava" />
        </datalist>
      </div>
    </div>
  );
}
