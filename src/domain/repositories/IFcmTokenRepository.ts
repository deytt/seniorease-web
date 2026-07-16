export interface IFcmTokenRepository {
  saveToken(userId: string, token: string): Promise<void>;
  removeToken(userId: string, token: string): Promise<void>;
}
