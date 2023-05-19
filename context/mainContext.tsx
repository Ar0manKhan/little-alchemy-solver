import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

type mainStateType = {
  availableItems: Set<string>;
};
const initialState: mainStateType = {
  availableItems: new Set<string>(),
};

type mainActionType =
  | {
      type: "LOAD_AVAILABLE_ITEMS";
    }
  | {
      type: "ADD_ITEM";
      payload: string;
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
  useEffect(() => {}, []);
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
  switch (action.type) {
    case "LOAD_AVAILABLE_ITEMS":
      return { ...state };
    case "ADD_ITEM":
      return state;
    default:
      return state;
  }
}

export default function useMainContext() {
  const context = useContext(MainContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within CheckoutContext");
  }
  return context;
}
