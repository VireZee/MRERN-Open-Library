import { gql } from '@apollo/client'

const FETCH = gql`
    query Fetch($author_key: [String!]!, $cover_edition_key: String!, $cover_i: Int!) {
        fetch(author_key: $author_key, cover_edition_key: $cover_edition_key, cover_i: $cover_i) {
            key
            added
        }
    }
`
export default FETCH