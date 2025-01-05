import { render, screen } from '@testing-library/react'
import Home from '../app/page'
import '@testing-library/jest-dom'

describe('Home Page', () => {
  it('renders the Next.js logo', () => {
    render(<Home />)
    const logo = screen.getByAltText('Next.js logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders the getting started instructions', () => {
    render(<Home />)
    const instructions = screen.getByText(/Get started by editing/)
    expect(instructions).toBeInTheDocument()
  })

  it('renders the deploy button', () => {
    render(<Home />)
    const deployButton = screen.getByText('Deploy now')
    expect(deployButton).toBeInTheDocument()
    expect(deployButton).toHaveAttribute('href', 'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app')
  })

  it('renders the footer links', () => {
    render(<Home />)
    const learnLink = screen.getByText('Learn')
    const examplesLink = screen.getByText('Examples')
    const docsLink = screen.getByText(/Go to nextjs.org/)

    expect(learnLink).toBeInTheDocument()
    expect(examplesLink).toBeInTheDocument()
    expect(docsLink).toBeInTheDocument()
  })
})