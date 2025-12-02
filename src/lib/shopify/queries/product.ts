import productFragment from "../fragments/product";
import settings from "../../../settings.json";

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!, $country: CountryCode = ${settings.defaultCurrency})
  @inContext(country: $country) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!, $country: CountryCode = ${settings.defaultCurrency})
  @inContext(country: $country) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;

export const getAllProductsQuery = /* GraphQL */ `
  query getAllProducts($country: CountryCode = ${settings.defaultCurrency}, $reverse: Boolean, $sortKey: ProductSortKeys) 
  @inContext(country: $country) {
    products(first: 250, reverse: $reverse, sortKey: $sortKey) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $country: CountryCode = ${settings.defaultCurrency}
  ) @inContext(country: $country) {
    collection(handle: $handle) {
      products(sortKey: $sortKey, reverse: $reverse, first: 100) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;
