import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

// Tipos
interface LightModalProps {
  id: string;
  content: ReactNode;
}

interface ModalContextType {
  addModal: (content: ReactNode) => void;
  removeModal: (id: string) => void;
}

// Contexto
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

// Proveedor del contexto
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<LightModalProps[]>([]);

  const removeModal = useCallback((id: string) => {
    setModals((prevModals) => prevModals.filter((modal) => modal.id !== id));
  }, []);

  const addModal = useCallback(
    (content: ReactNode) => {
      const id = Math.random().toString(36).substr(2, 9);
      setModals((prevModals) => [...prevModals, { id, content }]);
      setTimeout(() => removeModal(id), 2000);
    },
    [removeModal]
  ); // Añadimos removeModal como dependencia aquí

  return (
    <ModalContext.Provider value={{ addModal, removeModal }}>
      {children}
      <ModalContainer modals={modals} removeModal={removeModal} />
    </ModalContext.Provider>
  );
}

// Componente de Modal Individual
function LightModal({
  content,
  onClose,
}: {
  content: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-xl max-w-xs w-full mb-2">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-800 mr-2">{content}</div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Contenedor de Modales
function ModalContainer({
  modals,
  removeModal,
}: {
  modals: LightModalProps[];
  removeModal: (id: string) => void;
}) {
  return (
    <div className="fixed  top-20 right-4 z-[9999] flex flex-col items-end">
      {modals.map((modal) => (
        <LightModal
          key={modal.id}
          content={modal.content}
          onClose={() => removeModal(modal.id)}
        />
      ))}
    </div>
  );
}
