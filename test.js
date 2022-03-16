const { MeiliSearch } = require('meilisearch')

const client = new MeiliSearch({
  host: 'https://integration-demos.meilisearch.com',
  apiKey:
    'q7QHwGiX841a509c8b05ef29e55f2d94c02c00635f729ccf097a734cbdf7961530f47c47',
})

const params = {
  facetsDistribution: ['genres', 'players', 'platforms', 'misc'],
  attributesToCrop: ['description:50'],
  attributesToHighlight: ['*'],
  limit: 60,
  q: '',
}

const allFilters2 = {
  ...params,
  filter: [
    ['genres="Action"', 'genres="Adventure"', 'genres="Casual"'],
    ['players="Coop"'],
    ['platforms="MacOS"'],
  ],
}

const allFilters = {
  facetsDistribution: ['misc', 'genres', 'players', 'platforms'],
  attributesToCrop: ['description:50'],
  filter: [
    'misc="Early access"',
    'misc="Free to play"',
    'misc="VR support"',
    ['genres="Casual"'],
  ],
  attributesToHighlight: ['*'],
  limit: 60,
  q: '',
}

const noGenres = {
  ...params,
  filter: ['misc="Early access"', 'misc="Free to play"', 'misc="VR support"'],
}

const noPlayers = {
  ...params,
  filter: [
    'misc="Early access"',
    'misc="Free to play"',
    'misc="VR support"',
    ['genres="Casual"'],
  ],
}

const noPlatforms = {
  ...params,
  filter: [
    'misc="Early access"',
    'misc="Free to play"',
    'misc="VR support"',
    ['genres="Casual"'],
  ],
}

const noMisc = {
  ...params,
  filter: [['genres="Casual"']],
}

;(async () => {
  const mainResults = await client
    .index('steam-video-games')
    .search('', allFilters)
  console.log(mainResults.facetsDistribution)

  const noGenresResult = await client
    .index('steam-video-games')
    .search('', noGenres)

  const noPlatformsResult = await client
    .index('steam-video-games')
    .search('', noPlatforms)

  const noPlayersResult = await client
    .index('steam-video-games')
    .search('', noPlayers)

  const noMiscResult = await client
    .index('steam-video-games')
    .search('', noMisc)

  const facetsDistribution = {
    genres: noGenresResult.facetsDistribution.genres,
    misc: noMiscResult.facetsDistribution.misc,
    platforms: noPlatformsResult.facetsDistribution.platforms,
    players: noPlayersResult.facetsDistribution.players,
  }

  console.log(facetsDistribution)
})()

// // const { instantMeiliSearch } = require('./dist/instant-meilisearch.cjs')

// const searchClient = instantMeiliSearch(
//   'https://integration-demos.meilisearch.com',
//   'q7QHwGiX841a509c8b05ef29e55f2d94c02c00635f729ccf097a734cbdf7961530f47c47',
//   {
//     paginationTotalHits: 60,
//     primaryKey: 'id',
//   }
// )

// console.log(searchClient)
