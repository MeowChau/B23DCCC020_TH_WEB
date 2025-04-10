export interface Club {
  id: string;
  name: string;
  avatar?: string;
  establishmentDate: string;
  description: string;
  president: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  skills: string;
  clubId: string;
  clubName?: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  notes?: string;
  registrationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberHistory {
  id: string;
  memberId: string;
  memberName: string;
  action: 'approve' | 'reject' | 'transfer';
  previousClubId?: string;
  previousClubName?: string;
  newClubId?: string;
  newClubName?: string;
  reason?: string;
  performedBy: string;
  performedAt: string;
}

export interface ClubStatistics {
  totalClubs: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  applicationsByClub: {
    clubId: string;
    clubName: string;
    pending: number;
    approved: number;
    rejected: number;
  }[];
}

export interface MemberApplication {
  id: string;
  memberId: string;
  clubId: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClubMember {
  id: string;
  memberId: string;
  clubId: string;
  joinDate: string;
  role: 'member' | 'admin';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
} 