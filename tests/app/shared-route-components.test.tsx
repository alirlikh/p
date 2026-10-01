import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAppMocks } from './app-test-mocks';
import RootLayout, { generateMetadata } from '@/app/(routes)/layout';
import MainLayout from '@/app/(routes)/(main)/layout';
import Home from '@/app/(routes)/(main)/page';
import Loading from '@/app/(routes)/loading';
import NotFound from '@/app/(routes)/not-found';
import ErrorPage from '@/app/(routes)/error';

vi.mock('next/font/google', () => ({
  Raleway: () => ({ variable: 'font-raleway' }),
}));
vi.mock('next/navigation', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return {
    useRouter: () => getAppMocks().router,
    redirect: getAppMocks().redirect,
    notFound: getAppMocks().notFound,
  };
});
vi.mock('@/lib/logger', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return { logger: { error: getAppMocks().loggerError } };
});
vi.mock('@/components/materials/header/header', () => ({
  default: () => <div data-testid="header" />,
}));
vi.mock('@/components/materials/footer/Footer', () => ({
  default: () => <div data-testid="footer" />,
}));
vi.mock('@/components/templates/goTop/GoTop', () => ({
  default: () => <div data-testid="go-top" />,
}));
vi.mock('@/components/templates/landingBannerSection/LandingBannerSection', () => ({
  default: () => <div data-testid="landing-banner" />,
}));
vi.mock('@/components/templates/experienceSliderSection/ExperienceSliderSection', () => ({
  default: () => <div data-testid="experience-slider" />,
}));
vi.mock('@/components/templates/routinBanner/RoutinBanner', () => ({
  default: () => <div data-testid="routine-banner" />,
}));
vi.mock('@/components/templates/technologiesSection/TechnologiesSection', () => ({
  default: () => <div data-testid="technologies-section" />,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const appMocks = getAppMocks();

describe('root layout', () => {
  it('renders the document shell and excludes indexing outside production', async () => {
    const root = RootLayout({ children: <p>Application</p> });

    expect(root.type).toBe('html');
    expect(root.props.lang).toBe('en');
    await expect(generateMetadata()).resolves.toMatchObject({
      robots: { follow: false, index: false },
    });
  });
});

describe('public layout', () => {
  it('renders shared navigation, footer, and its child page', () => {
    render(
      <MainLayout>
        <p>Public page</p>
      </MainLayout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('go-top')).toBeInTheDocument();
    expect(screen.getByText('Public page')).toBeInTheDocument();
  });
});

describe('home page', () => {
  it('renders all homepage sections and structured data', () => {
    const { container } = render(<Home />);

    expect(screen.getByTestId('landing-banner')).toBeInTheDocument();
    expect(screen.getByTestId('experience-slider')).toBeInTheDocument();
    expect(screen.getByTestId('routine-banner')).toBeInTheDocument();
    expect(screen.getByTestId('technologies-section')).toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).toBeInTheDocument();
  });
});

describe('loading page', () => {
  it('renders its loading indicator', () => {
    expect(render(<Loading />).container.firstChild).toBeInTheDocument();
  });
});

describe('not-found page', () => {
  it('shows the 404 message and links back home', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go back home' })).toHaveAttribute('href', '/');
  });
});

describe('error page', () => {
  it('invokes the recovery callback and links home', () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error('failed')} reset={reset} />);

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(reset).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/');
    expect(appMocks.loggerError).toHaveBeenCalledWith('Application error', expect.any(Error));
  });
});
