'use client';

import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adminUser, adminLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!adminLoading && !adminUser) {
      router.push('/admin/login');
    }
  }, [adminUser, adminLoading, router]);

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}