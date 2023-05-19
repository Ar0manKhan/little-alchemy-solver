import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

type mainStateType = {
  availableItems: Set<string>;
  allItems: string[];
};
const initialState: mainStateType = {
  availableItems: new Set(),
  allItems: [],
};

type mainActionType =
  | {
      type: "INITIAL_LOAD";
      payload: {
        itemsList: string[];
      };
    }
  | {
      type: "ADD_ITEM";
      payload: {
        item: string;
      };
    };
const MainContext = createContext<{
  state: mainStateType;
  dispatch: Dispatch<mainActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(MainReducer, initialState);
  useEffect(() => {
    const controller = new AbortController();
    async function loadItems() {
      const res = await fetch("/items-list.json", {
        signal: controller.signal,
      });
      const data = await res.json();
      dispatch({
        type: "INITIAL_LOAD",
        payload: {
          itemsList: data,
        },
      });
    }
    loadItems();
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <MainContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

function MainReducer(state: mainStateType, action: mainActionType) {
  if (process.env.NODE_ENV === "development")
    console.log("[MAIN]", { state, action });
  const newState = { ...state };
  const { type, payload } = action;
  switch (type) {
    case "INITIAL_LOAD":
      // Loading items list
      newState.allItems = payload.itemsList;
      // laod available items from localstorage
      const availableItems = localStorage.getItem("availableItems");
      if (availableItems) {
        newState.availableItems = new Set(JSON.parse(availableItems));
      }
      return newState;
    case "ADD_ITEM":
      newState.availableItems = new Set(newState.availableItems);
      newState.availableItems.add(payload.item);
      localStorage.setItem(
        "availableItems",
        JSON.stringify(Array.from(newState.availableItems))
      );
      return newState;
    default:
      return newState;
  }
}

export default function useMainContext() {
  const context = useContext(MainContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within CheckoutContext");
  }
  return context;
}
