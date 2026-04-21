'use client';

import { Alert, Grow, Snackbar } from "@mui/material";
import { createContext, useContext, useState } from "react";

type toastType = "error" | "info" | "warning" | "success";

type ToastContext = {
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
  showInfo: (message: string) => void,
  showWarning: (message: string) => void
};

type Toast = {
  id: string,
  message: string,
  type: toastType
};

// Set the default value of the context for when it is accessed 
const ToastContext = createContext<ToastContext | null>(null);

export const useToast = () => {
  const toastContext = useContext(ToastContext);

  if(!toastContext) {
    throw new Error("useToast can only be used within the ToastProvider");
  }

  return toastContext;
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  const showError = (message: string) => {
    setToastList((prev) => {
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          message,
          type: "error"
        }
      ]
    })
  };

  const showSuccess = (message: string) => {
    setToastList((prev) => {
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          message,
          type: "success"
        }
      ]
    })
  };

  const showInfo = (message: string) => {
    setToastList((prev) => {
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          message,
          type: "info"
        }
      ]
    })
  };

  const showWarning = (message: string) => {
    setToastList((prev) => {
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          message,
          type: "warning"
        }
      ]
    }) 
  };

  return (
    <>
      <ToastContext.Provider value={{
        showError,
        showWarning,
        showInfo,
        showSuccess, 
      }}>
        {children}
      </ToastContext.Provider>
      {toastList.map((toast) => {
        const handleClose = () => {
          setToastList((prev) =>  prev.filter((toastObject) => toastObject.id !== toast.id))
        }
        return (
          <Snackbar
            key={toast.id}
            open={true}
            slots={{ transition: Grow }}
            onClose={handleClose}
            autoHideDuration={1600}
          >
            <Alert 
              severity={toast.type}
              onClose={handleClose}
              variant="filled"
            >
              {toast.message}
            </Alert>
          </Snackbar>
        )
      })}
    </>
  )
}

export default ToastProvider
