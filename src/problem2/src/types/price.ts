export type PriceData = {
  readonly currency: string
  readonly date: string
  readonly price: number
}

export type PriceResponse = readonly PriceData[]

export type PriceMap = Record<string, number>

export type ExchangeRate = {
  readonly fromSymbol: string
  readonly toSymbol: string
  readonly rate: number
}
