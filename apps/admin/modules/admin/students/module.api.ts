"use client";

import { moduleApiCall } from "@settle/core";

// Endpoint Constants
const ENDPOINTS = {
  STUDENTS: "/api/students/information/",
  SIGNATURES: "/api/students/signatures/",
  BATCHES: "/api/students/batches/",
  CONTACTS: "/api/students/contacts/",
  EXPERIENCES: "/api/students/experiences/",
  GRADINGS: "/api/students/gradings/",
  FAMILY_MEMBERS: "/api/students/family-members/",
  EDUCATIONS: "/api/students/educations/",
  MARKINGS: "/api/students/markings/",
  AUDIT_LOGS: "/api/students/audit-logs/",
};

// Main Student API
export const STUDENT_API = {
  getStudents: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.STUDENTS,
      paginationProps: params,
    });
  },

  getStudent: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.STUDENTS,
      id,
    });
    return { data };
  },

  createStudent: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.STUDENTS,
      body,
    });
    return { data: result };
  },

  updateStudent: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.STUDENTS,
      id,
      body,
    });
    return { data: result };
  },

  deleteStudent: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.STUDENTS,
      id,
    });
  },

  lockStudent: async (id: string) => {
    const result = await moduleApiCall.editRecord({
      endpoint: `${ENDPOINTS.STUDENTS}${id}/lock/`,
      id: "",
      body: {},
    });
    return { data: result };
  },

  unlockStudent: async (id: string) => {
    const result = await moduleApiCall.editRecord({
      endpoint: `${ENDPOINTS.STUDENTS}${id}/unlock/`,
      id: "",
      body: {},
    });
    return { data: result };
  },
};

// Signatures API
export const SIGNATURE_API = {
  getSignatures: async (params?: any) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.SIGNATURES,
      params,
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },

  getSignature: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.SIGNATURES,
      id,
    });
    return { data };
  },

  createSignature: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.SIGNATURES,
      body,
    });
    return { data: result };
  },

  updateSignature: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.SIGNATURES,
      id,
      body,
    });
    return { data: result };
  },

  deleteSignature: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.SIGNATURES,
      id,
    });
  },
};

// Batches API
export const BATCH_API = {
  getBatches: async (params?: any) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.BATCHES,
      params,
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },

  getBatch: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.BATCHES,
      id,
    });
    return { data };
  },

  createBatch: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.BATCHES,
      body,
    });
    return { data: result };
  },

  updateBatch: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.BATCHES,
      id,
      body,
    });
    return { data: result };
  },

  deleteBatch: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.BATCHES,
      id,
    });
  },

  searchBatches: async (search: string) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.BATCHES,
      params: { search },
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },
};

// Contacts API (One-to-One with Student)
export const CONTACT_API = {
  getContacts: async (params?: any) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.CONTACTS,
      params,
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },

  getContact: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.CONTACTS,
      id,
    });
    return { data };
  },

  getContactByStudent: async (studentId: string) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.CONTACTS,
      params: { student: studentId },
    });
    const results = Array.isArray(data) ? data : data?.results || [];
    return { data: results[0] || null };
  },

  createContact: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.CONTACTS,
      body,
    });
    return { data: result };
  },

  updateContact: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.CONTACTS,
      id,
      body,
    });
    return { data: result };
  },

  deleteContact: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.CONTACTS,
      id,
    });
  },
};

// Experiences API (Many per Student)
export const EXPERIENCE_API = {
  getExperiences: async (studentId?: string) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.EXPERIENCES,
      params: studentId ? { student: studentId } : {},
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },

  getExperience: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.EXPERIENCES,
      id,
    });
    return { data };
  },

  createExperience: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.EXPERIENCES,
      body,
    });
    return { data: result };
  },

  updateExperience: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.EXPERIENCES,
      id,
      body,
    });
    return { data: result };
  },

  deleteExperience: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.EXPERIENCES,
      id,
    });
  },
};

// Gradings API (Many per Student)
export const GRADING_API = {
  getGradings: async (studentId?: string) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.GRADINGS,
      params: studentId ? { student: studentId } : {},
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },

  getGrading: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.GRADINGS,
      id,
    });
    return { data };
  },

  createGrading: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.GRADINGS,
      body,
    });
    return { data: result };
  },

  updateGrading: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.GRADINGS,
      id,
      body,
    });
    return { data: result };
  },

  deleteGrading: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.GRADINGS,
      id,
    });
  },
};

// Family Members API (Many per Student)
export const FAMILY_MEMBER_API = {
  getFamilyMembers: async (studentId?: string) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.FAMILY_MEMBERS,
      params: studentId ? { student: studentId } : {},
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },

  getFamilyMember: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.FAMILY_MEMBERS,
      id,
    });
    return { data };
  },

  createFamilyMember: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.FAMILY_MEMBERS,
      body,
    });
    return { data: result };
  },

  updateFamilyMember: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.FAMILY_MEMBERS,
      id,
      body,
    });
    return { data: result };
  },

  deleteFamilyMember: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.FAMILY_MEMBERS,
      id,
    });
  },
};

// Educations API (Many per Student)
export const EDUCATION_API = {
  getEducations: async (studentId?: string) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.EDUCATIONS,
      params: studentId ? { student: studentId } : {},
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },

  getEducation: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.EDUCATIONS,
      id,
    });
    return { data };
  },

  createEducation: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.EDUCATIONS,
      body,
    });
    return { data: result };
  },

  updateEducation: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.EDUCATIONS,
      id,
      body,
    });
    return { data: result };
  },

  deleteEducation: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.EDUCATIONS,
      id,
    });
  },
};

// Markings API (Attendance Records)
export const MARKING_API = {
  getMarkings: async (studentId?: string) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.MARKINGS,
      params: studentId ? { student: studentId } : {},
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },

  getMarking: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.MARKINGS,
      id,
    });
    return { data };
  },

  createMarking: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.MARKINGS,
      body,
    });
    return { data: result };
  },

  updateMarking: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.MARKINGS,
      id,
      body,
    });
    return { data: result };
  },

  deleteMarking: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.MARKINGS,
      id,
    });
  },
};

// Audit Logs API (Read-Only)
export const AUDIT_LOG_API = {
  getAuditLogs: async (params?: any) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.AUDIT_LOGS,
      params,
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },

  getAuditLog: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.AUDIT_LOGS,
      id,
    });
    return { data };
  },

  getAuditLogsByStudent: async (studentId: string, params?: any) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.AUDIT_LOGS,
      params: { student: studentId, ...params },
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },
};
