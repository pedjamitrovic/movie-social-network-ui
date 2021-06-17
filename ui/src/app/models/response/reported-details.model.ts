
import { ReportedStats } from './reported-stats.model';

export interface ReportedDetails {
  extended?: any;
  discriminator?: 'User' | 'Group' | 'Post' | 'Comment';
  reportedStats?: ReportedStats[];
}
