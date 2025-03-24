import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!session) {
    router.push('/admin/login');
    return null;
  }
  
  return (
    <>
      <Head>
        <title>Admin Dashboard | Fantastic AI Studio</title>
      </Head>
      <div className="bg-gray-100 min-h-screen">
        <div className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {session.user.name}</span>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-white text-primary px-4 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-bold text-lg text-primary mb-4">Website Statistics</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Pages:</span>
                  <span className="font-medium">4</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Components:</span>
                  <span className="font-medium">4</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Contact Form Submissions:</span>
                  <span className="font-medium">0</span>
                </li>
              </ul>
            </div>
            
            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-bold text-lg text-primary mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-accent text-white py-2 px-4 rounded hover:bg-accent/90 transition-colors">
                  Edit Homepage
                </button>
                <button className="w-full bg-secondary text-white py-2 px-4 rounded hover:bg-secondary/90 transition-colors">
                  Manage Services
                </button>
                <button className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">
                  View Contact Submissions
                </button>
              </div>
            </div>
            
            {/* Environment Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-bold text-lg text-primary mb-4">Environment</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Node.js Version:</span>
                  <span className="font-medium">18.x</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Next.js Version:</span>
                  <span className="font-medium">13.x</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">VAPI Integration:</span>
                  <span className="font-medium text-green-600">Active</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Server-side authentication check
export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
  
  return {
    props: { session },
  };
}
