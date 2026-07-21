import { render, screen, fireEvent } from '@testing-library/react'
import { CartIcon } from '../CartIcon'
import { CartProvider } from '@/components/providers/CartProvider'

// Mock del useCart
jest.mock('@/components/providers/CartProvider', () => ({
  ...jest.requireActual('@/components/providers/CartProvider'),
  useCart: jest.fn(),
}))

import { useCart } from '@/components/providers/CartProvider'

describe('CartIcon', () => {
  const mockOpenCart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useCart as jest.Mock).mockReturnValue({
      itemCount: 0,
      openCart: mockOpenCart,
      isLoading: false,
    })
  })

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<CartProvider>{component}</CartProvider>)
  }

  it('debería renderizar el icono del carrito', () => {
    renderWithProvider(<CartIcon />)

    const button = screen.getByRole('button', { name: /abrir carrito/i })
    expect(button).toBeInTheDocument()
  })

  it('debería llamar a openCart al hacer click', () => {
    renderWithProvider(<CartIcon />)

    const button = screen.getByRole('button', { name: /abrir carrito/i })
    fireEvent.click(button)

    expect(mockOpenCart).toHaveBeenCalledTimes(1)
  })

  it('debería mostrar el contador cuando hay items', () => {
    ;(useCart as jest.Mock).mockReturnValue({
      itemCount: 3,
      openCart: mockOpenCart,
      isLoading: false,
    })

    renderWithProvider(<CartIcon />)

    const badge = screen.getByText('3')
    expect(badge).toBeInTheDocument()
  })

  it('debería mostrar "9+" cuando hay más de 9 items', () => {
    ;(useCart as jest.Mock).mockReturnValue({
      itemCount: 15,
      openCart: mockOpenCart,
      isLoading: false,
    })

    renderWithProvider(<CartIcon />)

    const badge = screen.getByText('9+')
    expect(badge).toBeInTheDocument()
  })

  it('debería tener un aria-label descriptivo con el número de productos', () => {
    ;(useCart as jest.Mock).mockReturnValue({
      itemCount: 5,
      openCart: mockOpenCart,
      isLoading: false,
    })

    renderWithProvider(<CartIcon />)

    const button = screen.getByRole('button', {
      name: /abrir carrito de compras \(5 productos\)/i,
    })
    expect(button).toBeInTheDocument()
  })

  it('debería estar deshabilitado cuando isLoading es true', () => {
    ;(useCart as jest.Mock).mockReturnValue({
      itemCount: 0,
      openCart: mockOpenCart,
      isLoading: true,
    })

    renderWithProvider(<CartIcon />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('no debería mostrar el contador cuando itemCount es 0', () => {
    renderWithProvider(<CartIcon />)

    const badge = screen.queryByText(/\d+/)
    expect(badge).not.toBeInTheDocument()
  })
})
