/**
 * Shared TypeScript interfaces for the Student Freelance Platform.
 * These types mirror the backend MongoDB schemas and are used
 * throughout the frontend to replace `any` with strict typing.
 */

/** Base user account fields returned from the API */
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'business';
}

/** Student profile — linked to a User with role 'student' */
export interface StudentProfile {
  _id: string;
  user_id: User | string;
  university: string;
  skills: string[];
  portfolio_link: string[];
  course: string;
  avatar: string;
  rating: number;
  review_count: number;
}

/** Business profile — linked to a User with role 'business' */
export interface BusinessProfile {
  _id: string;
  user_id: User | string;
  company_name: string;
  company_logo: string;
  company_description: string;
  rating: number;
  review_count: number;
}

/** A job posting created by a business user */
export interface Job {
  _id: string;
  client_id: User;
  title: string;
  description: string;
  deadline: string;
  status: string;
  budget: number;
  required_skills: string[];
  type: string;
}

/** A student's proposal (application) for a specific job */
export interface Proposal {
  _id: string;
  job_id: Job | string;
  freelancer_id: User;
  bid_amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  cover_letter: string;
}

/** A contract created when a proposal is accepted */
export interface Contract {
  _id: string;
  proposal_id: Proposal;
  payment_status: 'pending' | 'completed' | 'pending_approval';
  end_date: string;
  business_rating?: number;
  business_review?: string;
  student_rating?: number;
  student_review?: string;
}

/** Shape of the login/register API response */
export interface AuthResponse {
  access_token: string;
  role: 'student' | 'business';
}
