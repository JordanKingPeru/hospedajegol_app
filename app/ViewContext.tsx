import React, {
  createContext,
  useContext,
  useState,
  FC,
  ReactNode
} from 'react'

interface ViewContextState {
  viewState: string
  content: string
  isLoading: boolean
}

interface ViewContextProps extends ViewContextState {
  setViewState: React.Dispatch<React.SetStateAction<string>>
  setContent: React.Dispatch<React.SetStateAction<string>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const ViewContext = createContext<ViewContextProps | undefined>(undefined)

export const ViewContextProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [viewState, setViewState] = useState<string>('reporte')
  const [content, setContent] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(false)

  return (
    <ViewContext.Provider
      value={{
        viewState,
        setViewState,
        content,
        setContent,
        isLoading,
        setLoading
      }}
    >
      {children}
    </ViewContext.Provider>
  )
}

export const useViewContext = () => {
  const context = useContext(ViewContext)
  if (!context) {
    throw new Error('useViewContext must be used within a ViewContextProvider')
  }
  return context
}
