import { githubApi, handleApiError } from '@/utils/api';
import type { Token, TokenList, GitHubApiResponse } from '@/types';

const GITHUB_REPO_OWNER = 'Switcheo';
const GITHUB_REPO_NAME = 'token-icons';
const TOKENS_PATH = 'tokens';
const RAW_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export const fetchTokenList = async (): Promise<TokenList> => {
  try {
    const response = await githubApi.get<GitHubApiResponse[]>(
      `/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${TOKENS_PATH}`
    );

    const tokens: Token[] = response.data
      .filter((file) => file.type === 'file' && file.name.endsWith('.svg'))
      .map((file) => {
        const symbol = file.name.replace('.svg', '');
        return {
          symbol,
          name: symbol, // We'll use symbol as name since we don't have full names
          iconUrl: `${RAW_BASE_URL}/${file.name}`,
        };
      })
      .sort((a, b) => a.symbol.localeCompare(b.symbol));

    return tokens;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(`Failed to fetch token list: ${apiError.message}`);
  }
};

export const getTokenBySymbol = (tokens: TokenList, symbol: string): Token | undefined => {
  if (!symbol || !tokens) return undefined;

  return tokens.find((token) =>
    token?.symbol?.toLowerCase() === symbol.toLowerCase()
  );
};
