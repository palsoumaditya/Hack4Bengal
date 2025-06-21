'use client';

import React from 'react';

type Complaint = {
  id: number;
  workerName: string;
  issue: string;
  status: 'Resolved' | 'Pending' | 'Under Review';
  date: string;
};

interface ComplaintsListProps {
  complaints: Complaint[];
}

const statusColorMap = {
  Resolved: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  'Under Review': 'bg-blue-100 text-blue-800',
};

const ComplaintsList: React.FC<ComplaintsListProps> = ({ complaints }) => {
  if (!complaints || complaints.length === 0) {
    return <p className="text-gray-500 text-center py-4">No complaints recorded.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Worker Name</th>
            <th scope="col" className="px-6 py-3">Issue</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{complaint.workerName}</td>
              <td className="px-6 py-4">{complaint.issue}</td>
              <td className="px-6 py-4">{complaint.date}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorMap[complaint.status]}`}>
                  {complaint.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintsList;