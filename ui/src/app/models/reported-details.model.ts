
import { ReportedStats } from './reported-stats.model';

export interface ReportedDetails {
  type?: 'User' | 'Group' | 'Post' | 'Comment';
  id?: string;
  reportedStats?: ReportedStats[];
}
