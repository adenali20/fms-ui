import axios from '../../api/axios';

const graphqlRequest = async (query, variables = {}) => {
  const token = sessionStorage.getItem('jwtToken');

  const response = await axios.post(
    '/api/fleetservice/graphql',
    { query, variables },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.data.errors) {
    throw new Error('GraphQL error');
  }

  return response.data.data;
};

export const fetchFleetsApi = ({ after, size }) =>
  graphqlRequest(
    `
    query Fleets($after: String, $size: Int!) {
      fleetsWithPagination(after: $after, size: $size) {
        edges {
          node { id name plate }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
    `,
    { after, size }
  );

export const createFleetApi = (input) =>
  graphqlRequest(
    `mutation ($input: CreateFleetInput!) {
      createFleet(input: $input) { id }
    }`,
    { input }
  );

export const attachDeviceApi = (input) =>
  graphqlRequest(
    `mutation ($input: CreateDeviceInput!) {
      attachDevice(input: $input) { id }
    }`,
    { input }
  );
