import cartFragment from "../fragments/cart";

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!, $country: CountryCode = US)
  @inContext(country: $country) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;
