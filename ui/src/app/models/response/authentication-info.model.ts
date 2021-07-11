export interface AuthenticationInfo {
  id?: number;
  qualifiedName?: string;
  discriminator?: string;
  isBanned?: boolean;
  bannedUntil?: string;
  bannedReason?: string;
  token?: string;
}
