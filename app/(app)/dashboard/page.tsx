'use client';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR('/api/me/kits', fetcher);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Kits</h1>
      {isLoading && <p>Loading your kits...</p>}
      {error && <p className="text-red-500">Failed to load kits. Please try again later.</p>}
      {data && (
        <div className="space-y-4">
          {data.kits.length === 0 && <p>You haven't created any kits yet.</p>}
          {data.kits.map((kit: any) => (
            <div key={kit.id} className="p-4 border border-neutral-800 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{kit.address || 'Untitled Kit'}</p>
                <p className="text-sm text-neutral-400">
                  Created on {new Date(kit.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  kit.status === 'READY' ? 'bg-green-500/20 text-green-400' :
                  kit.status === 'PROCESSING' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {kit.status}
                </span>
                <Link href={`/kit/${kit.id}`} className="text-sm hover:underline">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
