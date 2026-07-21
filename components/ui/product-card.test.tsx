import { render, screen } from '@testing-library/react'
import { ProductCard } from './product-card'

// Mock de next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock de next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}))

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Perfume Test',
    price: '$19.990',
    image: '/test-image.jpg',
    slug: 'perfume-test',
  }

  it('debería renderizar el nombre del producto', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Perfume Test')).toBeInTheDocument()
  })

  it('debería renderizar el precio', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('$19.990')).toBeInTheDocument()
  })

  it('debería tener un link al producto', () => {
    render(<ProductCard product={mockProduct} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/product/perfume-test')
  })

  it('debería renderizar la imagen del producto', () => {
    render(<ProductCard product={mockProduct} />)

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('alt', 'Perfume Test')
  })

  it('debería tener las clases CSS correctas', () => {
    const { container } = render(<ProductCard product={mockProduct} />)

    const card = container.querySelector('.group')
    expect(card).toHaveClass('group')
  })
})
