import type { Club, Member, MemberHistory, ClubStatistics, MemberApplication } from '@/models/club';
import request from '../utils/request'; // Adjusted to use alias for correct path

namespace API {
  export type Result<T> = {
    success: boolean;
    data: T;
    message?: string;
  };
}


// Club APIs
export async function getClubs(params?: any) {
  return request<API.Result<Club[]>>('/api/clubs', {
    method: 'GET',
    params,
  });
}

export async function createClub(data: Partial<Club>) {
  return request<API.Result<Club>>('/api/clubs', {
    method: 'POST',
    data,
  });
}

export async function updateClub(id: string, data: Partial<Club>) {
  return request<API.Result<Club>>(`/api/clubs/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteClub(id: string) {
  return request<API.Result<void>>(`/api/clubs/${id}`, {
    method: 'DELETE',
  });
}

// Member Application APIs
export async function getMemberApplications(params?: any) {
  return request<API.Result<Member[]>>('/api/members/applications', {
    method: 'GET',
    params,
  });
}

export async function createMemberApplication(data: Partial<Member>) {
  return request<API.Result<Member>>('/api/members/applications', {
    method: 'POST',
    data,
  });
}

export async function updateMemberApplication(id: string, data: Partial<MemberApplication>) {
  return request<API.Result<MemberApplication>>(`/api/members/applications/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteMemberApplication(id: string) {
  return request<API.Result<void>>(`/api/members/applications/${id}`, {
    method: 'DELETE',
  });
}

export async function updateMemberStatus(id: string, data: { status: string; reason?: string }) {
  return request<API.Result<Member>>(`/api/members/${id}/status`, {
    method: 'PUT',
    data,
  });
}

// Club Member APIs
export async function getClubMembers(clubId: string) {
  return request<API.Result<Member[]>>(`/api/clubs/${clubId}/members`, {
    method: 'GET',
  });
}

export async function transferMembers(data: { memberIds: string[]; newClubId: string }) {
  return request<API.Result<void>>('/api/members/transfer', {
    method: 'POST',
    data,
  });
}

export async function getMemberHistory(memberId: string) {
  return request<API.Result<MemberHistory[]>>(`/api/members/${memberId}/history`, {
    method: 'GET',
  });
}

// Statistics APIs
export async function getClubStatistics() {
  return request<API.Result<ClubStatistics>>('/api/statistics', {
    method: 'GET',
  });
}

export async function exportClubMembers(clubId: string) {
  return request<Blob>(`/api/clubs/${clubId}/export`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// Member APIs
export async function getMemberDetails(memberId: string) {
  return request<API.Result<Member>>(`/api/members/${memberId}`, {
    method: 'GET',
  });
}

export async function updateMember(memberId: string, data: Partial<Member>) {
  return request<API.Result<Member>>(`/api/members/${memberId}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteMember(memberId: string) {
  return request<API.Result<void>>(`/api/members/${memberId}`, {
    method: 'DELETE',
  });
} 
export const getActionHistory = async (memberId: string) => {
  // Giả lập API trả về lịch sử thao tác
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          action: 'Approved',
          timestamp: '2025-04-09 17:00',
          reason: '',
          admin: 'Admin A',
        },
        {
          id: '2',
          action: 'Rejected',
          timestamp: '2025-04-08 15:30',
          reason: 'Không đủ điều kiện',
          admin: 'Admin B',
        },
      ]);
    }, 500);
  });
};
// Hàm lưu lịch sử thao tác
export const saveActionHistory = async (memberId: string, action: string, reason?: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Lưu lịch sử: ${action} cho thành viên ${memberId} với lý do: ${reason || 'Không có lý do'}`);
      resolve(true);
    }, 500);
  });
};