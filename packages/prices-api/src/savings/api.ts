import { getHost, type Options } from '..'
import { fetchJson as fetch } from '../fetch'
import { getTimeRange } from '../timestamp'
import type * as Responses from './responses'
import * as Parsers from './parsers'

export async function getStatistics(options?: Options) {
  const host = getHost(options)
  const resp = await fetch<Responses.GetStatisticsResponse>(`${host}/v1/crvusd/savings/statistics`)

  return Parsers.parseStatistics(resp)
}

export async function getEvents(page: number, options?: Options) {
  const host = getHost(options)
  const resp = await fetch<Responses.GetEventsResponse>(`${host}/v1/crvusd/savings/events?page=${page}&per_page=10`)

  return {
    count: resp.count,
    events: resp.events.map(Parsers.parseEvent),
  }
}

export async function getYield(options?: Options) {
  const host = getHost(options)

  const { start, end } = getTimeRange({ daysRange: 10 })

  const resp = await fetch<Responses.GetYieldResponse>(
    `${host}/v1/crvusd/savings/yield?agg_number=1&agg_units=hour&start=${start}&end=${end}`,
  )

  return resp.data.map(Parsers.parseYield)
}

export async function getRevenue(page: number, options?: Options) {
  const host = getHost(options)
  const resp = await fetch<Responses.GetRevenueResponse>(`${host}/v1/crvusd/savings/revenue${page}&per_page=100`)

  return {
    totalDistributed: resp.total_distributed,
    history: resp.history.map(Parsers.parseRevenue),
  }
}
