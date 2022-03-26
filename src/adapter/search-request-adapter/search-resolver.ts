import {
  SearchContext,
  MeiliSearchResponse,
  SearchCacheInterface,
  MeiliSearchParams,
} from '../../types'

import { GoSearchClient } from '../../go-search';

import { addMissingFacets, extractFacets } from './filters'

/**
 * @param  {ResponseCacher} cache
 */
export function SearchResolver(cache: SearchCacheInterface) {
  return {
    /**
     * @param  {SearchContext} searchContext
     * @param  {MeiliSearchParams} searchParams
     * @param  {MeiliSearch} client
     * @returns {Promise}
     */
    searchResponse: async function (
      searchContext: SearchContext,
      searchParams: MeiliSearchParams,
      client: GoSearchClient
    ): Promise<any> {
      // Create key with relevant informations
      const key = cache.formatKey([
        searchParams,
        searchContext.indexUid,
        searchContext.query,
      ])
      const entry = cache.getEntry(key)

      // Request is cached.
      if (entry) return entry

      // Cache filters: todo components
      const facetsCache = extractFacets(searchContext, searchParams)

      // Make search request
      const searchResponse = await client.search(searchContext.query, searchParams)

      // Add missing facets back into facetsDistribution
      /*
      searchResponse.facetsDistribution = addMissingFacets(
        facetsCache,
        searchResponse.facetsDistribution
      )
      */

      // Cache response
      cache.setEntry<any>(key, searchResponse)
      return searchResponse
    },
  }
}
