"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  CheckoutState,
  CheckoutStep,
  UserInfo,
  ServiceSelection,
  ServiceConfig,
  initialCheckoutState,
} from "../types/checkout";

// Action types
type CheckoutAction =
  | { type: "SET_STEP"; payload: CheckoutStep }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_USER_INFO"; payload: Partial<UserInfo> }
  | { type: "SET_SERVICE_SELECTION"; payload: Partial<ServiceSelection> }
  | { type: "SET_SERVICE_CONFIG"; payload: Partial<ServiceConfig> }
  | { type: "RESET" };

// Context type
interface CheckoutContextType {
  state: CheckoutState;
  dispatch: React.Dispatch<CheckoutAction>;
  goToStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  updateServiceSelection: (selection: Partial<ServiceSelection>) => void;
  updateServiceConfig: (config: Partial<ServiceConfig>) => void;
  reset: () => void;
}

// Reducer function
function checkoutReducer(
  state: CheckoutState,
  action: CheckoutAction
): CheckoutState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(4, state.currentStep + 1) as CheckoutStep,
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(1, state.currentStep - 1) as CheckoutStep,
      };
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: { ...state.userInfo, ...action.payload },
      };
    case "SET_SERVICE_SELECTION":
      return {
        ...state,
        serviceSelection: { ...state.serviceSelection, ...action.payload },
      };
    case "SET_SERVICE_CONFIG":
      return {
        ...state,
        serviceConfig: { ...state.serviceConfig, ...action.payload },
      };
    case "RESET":
      return initialCheckoutState;
    default:
      return state;
  }
}

// Create context
const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

// Provider component
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialCheckoutState);

  const goToStep = (step: CheckoutStep) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  const nextStep = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const prevStep = () => {
    dispatch({ type: "PREV_STEP" });
  };

  const updateUserInfo = (info: Partial<UserInfo>) => {
    dispatch({ type: "SET_USER_INFO", payload: info });
  };

  const updateServiceSelection = (selection: Partial<ServiceSelection>) => {
    dispatch({ type: "SET_SERVICE_SELECTION", payload: selection });
  };

  const updateServiceConfig = (config: Partial<ServiceConfig>) => {
    dispatch({ type: "SET_SERVICE_CONFIG", payload: config });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  const value: CheckoutContextType = {
    state,
    dispatch,
    goToStep,
    nextStep,
    prevStep,
    updateUserInfo,
    updateServiceSelection,
    updateServiceConfig,
    reset,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

// Custom hook to use checkout context
export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
