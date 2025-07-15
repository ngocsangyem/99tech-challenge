export type GitHubApiResponse = {
  readonly name: string
  readonly path: string
  readonly sha: string
  readonly size: number
  readonly url: string
  readonly html_url: string
  readonly git_url: string
  readonly download_url: string
  readonly type: string
  readonly _links: {
    readonly self: string
    readonly git: string
    readonly html: string
  }
}

export type GitHubApiError = {
  readonly message: string
  readonly documentation_url?: string
}

export type ApiError = {
  readonly message: string
  readonly code?: string | number
  readonly details?: unknown
}
