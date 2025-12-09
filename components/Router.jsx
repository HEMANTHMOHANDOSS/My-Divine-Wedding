
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';
import AdminDashboard from './admin/AdminDashboard';
import ParentDashboard from './dashboard/ParentDashboard';
import UserDashboard from './dashboard/UserDashboard';
import ProfileCreationWizard from './profile/ProfileCreationWizard';
import ParentRegistrationWizard from './parent/ParentRegistrationWizard';
import FAQPage from './FAQPage';
import CommunitiesPage from './public/CommunitiesPage';
import CompanyPage from './public/CompanyPage';
import SuccessStoriesPage from './public/SuccessStoriesPage';
import PublicMembership from './public/PublicMembership';
import ContactSection from './ContactSection';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/parent',
    element: <ParentDashboard />,
  },
  {
    path: '/dashboard',
    element: <UserDashboard />,
  },
  {
    path: '/register',
    element: <ProfileCreationWizard />,
  },
  {
    path: '/parent-register',
    element: <ParentRegistrationWizard />
  },
  {
    path: '/faq',
    element: <FAQPage />
  },
  {
    path: '/communities',
    element: <CommunitiesPage />
  },
    {
    path: '/company',
    element: <CompanyPage />
  },
  {
    path: '/stories',
    element: <SuccessStoriesPage />
  },
  {
    path: '/membership-public',
    element: <PublicMembership />
  },
  {
    path: '/contact',
    element: <ContactSection />
  }
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
