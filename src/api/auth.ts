/**
 * OAuth2 Authentication for Teamleader Focus API
 *
 * Handles token refresh and management.
 * Token endpoint: https://focus.teamleader.eu/oauth2/access_token
 */

import type { TeamleaderAuthConfig, TokenResponse } from "../types/index.js";

const TOKEN_URL = "https://focus.teamleader.eu/oauth2/access_token";
const TOKEN_BUFFER_MS = 60_000; // Refresh 60s before expiry

export class TeamleaderAuth {
  private config: TeamleaderAuthConfig;

  constructor(config: TeamleaderAuthConfig) {
    this.config = { ...config };
  }

  /**
   * Get a valid access token, refreshing if necessary.
   */
  async getAccessToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.config.accessToken!;
    }
    await this.refreshAccessToken();
    return this.config.accessToken!;
  }

  /**
   * Get the current refresh token (may have been rotated).
   */
  getRefreshToken(): string {
    return this.config.refreshToken;
  }

  private isTokenValid(): boolean {
    if (!this.config.accessToken || !this.config.tokenExpiresAt) {
      return false;
    }
    return Date.now() < this.config.tokenExpiresAt - TOKEN_BUFFER_MS;
  }

  private async refreshAccessToken(): Promise<void> {
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: this.config.refreshToken,
      grant_type: "refresh_token",
    });

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to refresh Teamleader token: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = (await response.json()) as TokenResponse;

    this.config.accessToken = data.access_token;
    this.config.tokenExpiresAt = Date.now() + data.expires_in * 1000;

    // Teamleader rotates refresh tokens
    if (data.refresh_token) {
      this.config.refreshToken = data.refresh_token;
    }
  }
}
