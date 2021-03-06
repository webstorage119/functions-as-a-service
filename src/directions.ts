import {Request, Response} from 'express';

import {TravelMode} from '@google/maps';
import {getClient} from './gmp_client';

/**
 * Returns directions from the provided origin to the provided destination.
 * Requires an `API_KEY` environment variable.
 * @see https://github.com/googlemaps/google-maps-services-js#nodejs-client-for-google-maps-services
 */
export default async (req: Request, res: Response) => {
  // Get the Maps Client
  let googleMapsClient;
  try {
    googleMapsClient = getClient();
  } catch (e) {
    return res.status(400).send(e);
  }

  // Validate travel mode
  const mode = req.query.mode;
  const VALID_MODES: TravelMode[] = ['driving', 'walking', 'bicycling', 'transit'];
  if (!VALID_MODES.includes(mode)) {
    return res.status(400).send(`Error: mode must be one of ${VALID_MODES.join(', ')}.`);
  }

  // Validate origin
  const origin = req.query.origin;
  if (!origin) {
    return res.status(400).send('Error: origin must be provided. Example: origin=37.7841393,-122.404467');
  }

  // Execute API request
  const destination = '1600 Amphitheatre Parkway, Mountain View, CA';
  const response = await googleMapsClient.directions({
    origin,
    destination,
    mode,
  }).asPromise();

  // Send the response
  res.send({
    data: response.json,
    request: {
      query: req.query,
      params: req.path,
    },
  });
};
