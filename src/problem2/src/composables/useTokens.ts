import { ref, computed, type Ref } from 'vue';
import { useFetch } from '@vueuse/core';
import { getTokenBySymbol } from '@/services/tokenService';
import type { Token, TokenList, GitHubApiResponse } from '@/types';

const GITHUB_REPO_OWNER = 'Switcheo';
const GITHUB_REPO_NAME = 'token-icons';
const TOKENS_PATH = 'tokens';
const RAW_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export const useTokens = () => {
  const {
    data: githubData,
    isFetching: isLoading,
    error,
    execute: refetchTokens,
  } = useFetch<GitHubApiResponse[]>(
    `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${TOKENS_PATH}`,
    {
      immediate: true,
    }
  ).json();

  const searchQuery: Ref<string> = ref('');

  const tokens = computed((): TokenList => {
    if (!githubData.value) return [];

    return githubData.value
      .filter((file: GitHubApiResponse) => file.type === 'file' && file.name.endsWith('.svg'))
      .map((file: GitHubApiResponse) => {
        const symbol = file.name.replace('.svg', '');
        return {
          symbol,
          name: symbol,
          iconUrl: `${RAW_BASE_URL}/${file.name}`,
        };
      })
      .sort((a: Token, b: Token) => a.symbol.localeCompare(b.symbol));
  });

  const filteredTokens = computed(() => {
    if (!searchQuery.value.trim()) {
      return tokens.value;
    }

    const query = searchQuery.value.toLowerCase().trim();
    return tokens.value.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query)
    );
  });

  const getToken = (symbol: string): Token | undefined => {
    return getTokenBySymbol(tokens.value, symbol);
  };

  const hasToken = (symbol: string): boolean => {
    return getToken(symbol) !== undefined;
  };

  const setSearchQuery = (query: string): void => {
    searchQuery.value = query;
  };

  const clearSearch = (): void => {
    searchQuery.value = '';
  };

  return {
    tokens,
    filteredTokens,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    searchQuery: computed(() => searchQuery.value),
    getToken,
    hasToken,
    setSearchQuery,
    clearSearch,
    refetchTokens,
  };
};
