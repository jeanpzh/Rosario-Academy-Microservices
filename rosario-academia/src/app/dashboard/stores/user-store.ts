import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Estado del store de usuario
 */
interface UserState {
  userId: string | null
  name: string | null
  email: string | null
}

/**
 * Acciones del store de usuario
 */
interface UserActions {
  setUser: (user: { userId: string; name: string; email: string }) => void
  clearUser: () => void
  updateName: (name: string) => void
  updateEmail: (email: string) => void
}

/**
 * Tipo completo del store
 */
type UserStore = UserState & UserActions

/**
 * Store de usuario con persistencia en localStorage
 *
 * Guarda automáticamente el ID, nombre y email del usuario
 * y los mantiene disponibles incluso después de recargar la página.
 *
 * @example
 * ```tsx
 * const { userId, name, email, setUser } = useUserStore();
 *
 * // Establecer usuario
 * setUser({ userId: '123', name: 'John Doe', email: 'john@example.com' });
 *
 * // Limpiar usuario
 * clearUser();
 * ```
 */
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // Estado inicial
      userId: null,
      name: null,
      email: null,

      // Acciones
      setUser: (user) =>
        set({
          userId: user.userId,
          name: user.name,
          email: user.email
        }),

      clearUser: () =>
        set({
          userId: null,
          name: null,
          email: null
        }),

      updateName: (name) => set({ name }),

      updateEmail: (email) => set({ email })
    }),
    {
      name: 'user-storage', // Nombre único para el almacenamiento en localStorage
      storage: createJSONStorage(() => localStorage) // Usar localStorage para persistencia
    }
  )
)
