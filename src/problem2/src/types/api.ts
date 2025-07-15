export type GitHubApiResponse = {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  _links: {
    self: string
    git: string
    html: string
  }
}

export type GitHubApiError = {
  message: string
  documentation_url?: string
}

export type ApiError = {
  message: string
  code?: string | number
  details?: unknown
}
