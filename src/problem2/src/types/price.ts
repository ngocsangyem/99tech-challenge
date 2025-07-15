export type PriceData = {
  currency: string
  date: string
  price: number
}

export type PriceResponse = PriceData[]

export type PriceMap = Record<string, number>

export type ExchangeRate = {
  fromSymbol: string
  toSymbol: string
  rate: number
}
