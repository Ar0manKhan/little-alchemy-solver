"use client";
import useMainContext, { MainContextProvider } from "@/context/mainContext";
import {
  TrashIcon,
  Bars3Icon,
  PlusCircleIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <MainContextProvider>
      <Navbar />
      <main className="px-6 py-4">
        <ItemsPossibleList />
      </main>
      <Footer />
    </MainContextProvider>
  );
}

function Navbar() {
  return (
    <div className="navbar bg-base-100 pr-6">
      <div className="flex-1">
        <p className="btn-ghost btn normal-case md:text-xl">
          Little Alchemy 2 Solver
        </p>
      </div>
      <div className="navbar-end flex w-auto gap-4">
        <NavbarAddDeleteBox />
        <FilterByItems />
      </div>
    </div>
  );
}

function NavbarAddDeleteBox() {
  return (
    <>
      <div className="hidden gap-4 md:inline-flex">
        <AddItemsInputBox />
        <ClearItems />
      </div>
      <div className="flex w-max gap-4 md:hidden">
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
        <label
          htmlFor="mobile-navbar-action"
          className="modal modal-bottom cursor-pointer sm:modal-middle"
        >
          <label htmlFor="" className="modal-box relative flex flex-col gap-4">
            <AddItemsInputBox />
            <ClearItems />
          </label>
        </label>
      </div>
    </>
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
    <div className="form-control flex flex-none flex-col justify-between gap-2 md:flex-row">
      <input
        type="text"
        placeholder="Add Item e.g. Fire"
        className="input-bordered input"
        id="available-item"
        list="available-items"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addItem();
          }
        }}
      />
      <button
        className="btn-outline btn-primary btn flex gap-2"
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
    <>
      <div
        // htmlFor="clear-items"
        className="btn-outline btn-error btn flex gap-2"
        onClick={() => {
          dispatch({
            type: "CLEAR_ITEMS",
            payload: {},
          });
        }}
      >
        <TrashIcon className="h-5 w-5" />
        <span>Clear Items</span>
      </div>
      {/* Delete confirmation */}
      {/* <input type="checkbox" id="clear-items" className="modal-toggle" />
      <div className="modal modal-bottom md:modal-middle">
        <div className="modal-box">
          <p>Are you sure you want to clear all items?</p>
          <div className="modal-action">
            <label
              htmlFor="clear-items"
              className="btn-error btn"
              onClick={() => {
                dispatch({
                  type: "CLEAR_ITEMS",
                  payload: {},
                });
              }}
            >
              Yes
            </label>
            <label htmlFor="clear-items" className="btn-success btn">
              No
            </label>
          </div>
        </div>
      </div> */}
    </>
  );
}

function FilterByItems() {
  const {
    state: { availableItems, filterByItems },
    dispatch,
  } = useMainContext();
  return (
    <>
      <label
        htmlFor="filter-by-items"
        className="btn-outline btn-primary btn flex gap-2"
      >
        <AdjustmentsHorizontalIcon
          className="h-5 w-5"
          title="Filter possible items list by items you have"
        />
        <span className="hidden md:inline">Filter</span>
      </label>
      <input type="checkbox" id="filter-by-items" className="modal-toggle" />
      <label
        htmlFor="filter-by-items"
        className=" modal modal-bottom cursor-pointer md:modal-middle"
      >
        <label htmlFor="" className="modal-box relative flex flex-col gap-4">
          <h3 className="font-lg font-bold">Filter suggestions by items</h3>
          {/* TODO: Add input box with datalist of availableItems, create reusuable component for this */}
          <div className="flex flex-wrap gap-2">
            {Array.from(availableItems)
              .sort()
              .map((item) => (
                <div
                  key={item}
                  className={`${
                    filterByItems?.has(item) ? "bg-base-300" : "opacity-50"
                  } rounded-box cursor-pointer border border-base-300 p-2 hover:bg-base-300`}
                  onClick={() => {
                    dispatch({
                      type: "TOGGLE_FILTER",
                      payload: { item },
                    });
                  }}
                >
                  {item}
                </div>
              ))}
          </div>
        </label>
      </label>
    </>
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
  const { availableItems, filterByItems } = useMainContext().state;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Object.entries(itemsMap)
        .filter(
          ([key, itemsList]) =>
            itemsList.some(
              ([item1, item2]) =>
                availableItems.has(item1) &&
                availableItems.has(item2) &&
                (!filterByItems ||
                  filterByItems.size === 0 ||
                  filterByItems.has(item1) ||
                  filterByItems.has(item2))
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
    state: { availableItems, filterByItems },
    dispatch,
  } = useMainContext();
  const [item1, item2] = items.find(
    ([a, b]) =>
      availableItems.has(a) &&
      availableItems.has(b) &&
      (!filterByItems ||
        filterByItems.size === 0 ||
        filterByItems.has(a) ||
        filterByItems.has(b))
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

function Footer() {
  return (
    <footer className="footer footer-center rounded bg-base-200 p-10 text-base-content">
      <div>
        <div className="grid grid-flow-col gap-4">
          <Link href="https://github.com/Ar0manKhan">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="256"
              height="256"
              className="h-6 w-6"
              viewBox="0 0 256 256"
            >
              <path
                fill="#000"
                strokeMiterlimit="10"
                strokeWidth="0"
                d="M45 0C20.147 0 0 20.467 0 45.714 0 67.034 14.367 84.944 33.802 90c-.013-5.283-.03-11.763-.04-13.782-12.986 2.869-15.726-5.595-15.726-5.595-2.123-5.481-5.183-6.939-5.183-6.939-4.236-2.943.319-2.883.319-2.883 4.687.334 7.156 4.887 7.156 4.887 4.163 7.249 10.92 5.153 13.584 3.942.419-3.064 1.628-5.157 2.964-6.341-10.368-1.199-21.268-5.265-21.268-23.435 0-5.177 1.824-9.407 4.81-12.728-.485-1.195-2.083-6.018.452-12.55 0 0 3.92-1.274 12.84 4.861 3.724-1.051 7.717-1.578 11.684-1.596 3.967.018 7.963.545 11.694 1.596 8.91-6.135 12.824-4.861 12.824-4.861 2.541 6.532.943 11.355.458 12.55 2.993 3.321 4.804 7.551 4.804 12.728 0 18.214-10.92 22.223-21.315 23.398 1.674 1.472 3.166 4.357 3.166 8.781 0 3.513-.016 11.601-.031 17.74C76.021 84.439 90 66.74 90 45.714 90 20.467 69.853 0 45 0z"
                transform="matrix(2.81 0 0 2.81 1.407 1.407)"
              ></path>
            </svg>
          </Link>
          <Link href="https://www.linkedin.com/in/arman-khan-1a8480208/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="256"
              height="256"
              className="h-6 w-6"
              viewBox="0 0 256 256"
            >
              <g fill="#000" strokeMiterlimit="10" strokeWidth="0">
                <path
                  d="M1.48 29.91h18.657v60.01H1.48V29.91zM10.809.08c5.963 0 10.809 4.846 10.809 10.819 0 5.967-4.846 10.813-10.809 10.813C4.832 21.712 0 16.866 0 10.899 0 4.926 4.832.08 10.809.08M31.835 29.91h17.89v8.206h.255c2.49-4.72 8.576-9.692 17.647-9.692C86.514 28.424 90 40.849 90 57.007V89.92H71.357V60.737c0-6.961-.121-15.912-9.692-15.912-9.706 0-11.187 7.587-11.187 15.412V89.92H31.835V29.91z"
                  transform="matrix(2.81 0 0 2.81 1.407 1.407)"
                ></path>
              </g>
            </svg>
          </Link>
        </div>
      </div>
      <div className="">
        <h2 className="mb-4 text-2xl font-bold">Special Thanks to:</h2>
        <ul className="">
          <li>
            <Link
              href="https://nextjs.org/"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Next.js
            </Link>{" "}
            &{" "}
            <Link
              href="https://react.dev/"
              className="text-blue-500 underline hover:text-blue-700"
            >
              React
            </Link>{" "}
            - for providing the powerful JavaScript framework that powers this
            app
          </li>
          <li>
            <Link
              href="https://www.ign.com/wikis/little-alchemy-2/Little_Alchemy_2_Cheats_-_List_of_All_Combinations"
              className="text-blue-500 underline hover:text-blue-700"
            >
              IGN
            </Link>{" "}
            - for generously providing the data that fuels this app
          </li>
          <li>
            <Link
              href="https://tailwindcss.com/"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Tailwind CSS
            </Link>{" "}
            and{" "}
            <Link
              href="https://daisyui.com/"
              className="text-blue-500 underline hover:text-blue-700"
            >
              DaisyUI
            </Link>{" "}
            - for their exceptional UI and styling capabilities, enhancing the
            visual appeal of this app
          </li>
          <li>
            <Link
              className="text-blue-500 underline hover:text-blue-700"
              href="https://heroicons.com/"
            >
              Heroicons
            </Link>
            - for their extensive collection of high-quality icons that enrich
            the user interface of this app
          </li>
          <li>
            <Link
              className="text-blue-500 underline hover:text-blue-700"
              href="https://iconpacks.net/"
            >
              IconPacks
            </Link>
            - for providing additional icons that complement the visual
            aesthetics of this app
          </li>
          <li>
            <Link
              href="https://vercel.com/"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Vercel
            </Link>{" "}
            - for providing a robust hosting platform that ensures the smooth
            deployment and reliable performance of this app
          </li>
          <li>
            <Link
              href="https://cheerio.js.org/"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Cheerio.js
            </Link>{" "}
            - for offering a powerful and flexible library that enables parsing
            of IGN page
          </li>
        </ul>
        <p className="text-sm text-gray-600">
          We extend our heartfelt gratitude to all the projects mentioned above
          for their invaluable contributions, which have made this app possible!
        </p>
      </div>
    </footer>
  );
}
