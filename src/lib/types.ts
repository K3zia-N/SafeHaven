import { Timestamp } from "firebase/firestore";

export interface CommunityPost {
  id: string; // Firestore document ID
  userId: string;
  author: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  replies: number;
}

export interface IncidentReport {
    id: string; // Firestore document ID
    userId: string;
    incidentType: string;
    incidentDate: Timestamp;
    location?: string;
    description: string;
    anonymous: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
