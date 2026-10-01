import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAppMocks } from './app-test-mocks';
import EducationList from '@/app/(routes)/(admin)/admin/education/page';
import CreateEducationForm from '@/app/(routes)/(admin)/admin/education/new/page';
import EditEducationPage from '@/app/(routes)/(admin)/admin/education/[id]/edit/page';
import EducationEditForm from '@/app/(routes)/(admin)/admin/education/[id]/edit/EducationEditForm';
import DeleteEducationClient from '@/app/(routes)/(admin)/admin/education/DeleteEducationClient';
import ExperienceList from '@/app/(routes)/(admin)/admin/experience/page';
import CreateExperienceForm from '@/app/(routes)/(admin)/admin/experience/new/page';
import EditExperiencePage from '@/app/(routes)/(admin)/admin/experience/[id]/edit/page';
import ExperienceEditForm from '@/app/(routes)/(admin)/admin/experience/[id]/edit/ExperienceEditForm';
import DeleteExperienceClient from '@/app/(routes)/(admin)/admin/experience/DeleteExperienceClient';
import ProjectList from '@/app/(routes)/(admin)/admin/project/page';
import CreateProjectForm from '@/app/(routes)/(admin)/admin/project/new/page';
import EditProjectPage from '@/app/(routes)/(admin)/admin/project/[id]/edit/page';
import ProjectEditForm from '@/app/(routes)/(admin)/admin/project/[id]/edit/ProjectEditForm';
import DeleteProjectClient from '@/app/(routes)/(admin)/admin/project/DeleteProjectClient';

vi.mock('@/lib/prisma', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return { default: getAppMocks().prisma };
});
vi.mock('@/lib/logger', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return { logger: { error: getAppMocks().loggerError } };
});
vi.mock('next/navigation', async () => {
  const { getAppMocks } = await import('./app-test-mocks');
  return {
    useRouter: () => getAppMocks().router,
    redirect: getAppMocks().redirect,
    notFound: getAppMocks().notFound,
  };
});

afterEach(() => cleanup());

const appMocks = getAppMocks();

describe('education administration', () => {
  it('renders the empty list', async () => {
    render(await EducationList());
    expect(screen.getByText(/No education entries found/)).toBeInTheDocument();
  });

  it('renders the create form', () => {
    render(<CreateEducationForm />);
    expect(screen.getByRole('heading', { name: /Add Education/ })).toBeInTheDocument();
  });

  it('renders an edit form from the matching record', async () => {
    appMocks.prisma.education.findUnique.mockResolvedValue({
      id: 'education-1',
      degree: 'BSc',
      degreeTitle: 'Computer Science',
      college: 'Example University',
      startTime: '2020',
      graduateTime: '2024',
      certificate: null,
    });
    expect(
      await EditEducationPage({ params: Promise.resolve({ id: 'education-1' }) })
    ).toBeTruthy();
  });

  it('signals not-found for a missing education record', async () => {
    await expect(
      EditEducationPage({ params: Promise.resolve({ id: 'missing' }) })
    ).rejects.toThrow('not-found');
  });

  it('renders education form values', () => {
    render(
      <EducationEditForm
        education={{
          id: 'education-1',
          degree: 'BSc',
          degreeTitle: 'Computer Science',
          college: 'Example University',
          startTime: '2020',
          graduateTime: '2024',
          certificate: null,
        }}
      />
    );
    expect(screen.getByDisplayValue('Computer Science')).toBeInTheDocument();
  });
});

describe('experience administration', () => {
  it('renders the empty list', async () => {
    render(await ExperienceList());
    expect(screen.getByText(/No experience entries found/)).toBeInTheDocument();
  });

  it('renders the create form', () => {
    render(<CreateExperienceForm />);
    expect(screen.getByRole('heading', { name: /Add Experience/ })).toBeInTheDocument();
  });

  it('renders an edit form from the matching record', async () => {
    appMocks.prisma.experience.findUnique.mockResolvedValue({
      id: 'experience-1',
      jobTitle: 'Developer',
      companyName: 'Example Co',
      type: 'Full-time',
      startTime: '2020',
      endTime: '2024',
      location: 'Remote',
      duties: [],
    });
    expect(
      await EditExperiencePage({ params: Promise.resolve({ id: 'experience-1' }) })
    ).toBeTruthy();
  });

  it('signals not-found for a missing experience record', async () => {
    await expect(
      EditExperiencePage({ params: Promise.resolve({ id: 'missing' }) })
    ).rejects.toThrow('not-found');
  });

  it('renders experience form values', () => {
    render(
      <ExperienceEditForm
        experience={{
          id: 'experience-1',
          jobTitle: 'Developer',
          companyName: 'Example Co',
          type: 'Full-time',
          startTime: '2020',
          endTime: '2024',
          location: 'Remote',
          duties: [],
        }}
      />
    );
    expect(screen.getByDisplayValue('Developer')).toBeInTheDocument();
  });
});

describe('project administration', () => {
  it('renders the empty list', async () => {
    render(await ProjectList());
    expect(screen.getByText(/No projects found/)).toBeInTheDocument();
  });

  it('renders the create form', () => {
    render(<CreateProjectForm />);
    expect(screen.getByRole('heading', { name: 'Add Project' })).toBeInTheDocument();
  });

  it('renders an edit form from the matching record', async () => {
    appMocks.prisma.project.findUnique.mockResolvedValue({
      id: 'project-1',
      name: 'Portfolio',
      image: 'https://example.com/image.png',
      githubUrl: null,
      demoUrl: null,
    });
    expect(await EditProjectPage({ params: Promise.resolve({ id: 'project-1' }) })).toBeTruthy();
  });

  it('signals not-found for a missing project record', async () => {
    await expect(
      EditProjectPage({ params: Promise.resolve({ id: 'missing' }) })
    ).rejects.toThrow('not-found');
  });

  it('renders project form values', () => {
    render(
      <ProjectEditForm
        project={{
          id: 'project-1',
          name: 'Portfolio',
          image: 'https://example.com/image.png',
          githubUrl: null,
          demoUrl: null,
        }}
      />
    );
    expect(screen.getByDisplayValue('Portfolio')).toBeInTheDocument();
  });
});

describe('portfolio delete controls', () => {
  it.each([
    [
      'education entry',
      <DeleteEducationClient key="education" id="education-1" name="Computer Science" />,
    ],
    [
      'experience entry',
      <DeleteExperienceClient key="experience" id="experience-1" name="Developer" />,
    ],
    ['project', <DeleteProjectClient key="project" id="project-1" name="Portfolio" />],
  ])('opens and cancels the delete confirmation for a %s', (_name, component) => {
    render(component);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByText(/This action cannot be undone/)).not.toBeInTheDocument();
  });
});
