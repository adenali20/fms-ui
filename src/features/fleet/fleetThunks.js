import {
  fetchFleetsStart,
  fetchFleetsSuccess,
  fetchFleetsFailure,
  resetFleets,
} from './fleetSlice';

import {
  fetchFleetsApi,
  createFleetApi,
  attachDeviceApi,
} from './fleetService';

export const loadFleets = (loadMore = false) => async (dispatch, getState) => {
  const { fleet } = getState();
  if (fleet.loading) return;

  dispatch(fetchFleetsStart());

  try {
    const data = await fetchFleetsApi({
      after: loadMore ? fleet.endCursor : null,
      size: 5,
    });

    const conn = data.fleetsWithPagination;

    dispatch(
      fetchFleetsSuccess({
        fleets: conn.edges.map(e => e.node),
        endCursor: conn.pageInfo.endCursor,
        hasNextPage: conn.pageInfo.hasNextPage,
        loadMore,
      })
    );
  } catch (err) {
    dispatch(fetchFleetsFailure(err.message));
  }
};

export const createFleet = (fleetForm) => async (dispatch) => {
  await createFleetApi(fleetForm);
  dispatch(resetFleets());
  dispatch(loadFleets(false));
};

export const attachDevice = (deviceForm) => async () => {
  await attachDeviceApi(deviceForm);
};
