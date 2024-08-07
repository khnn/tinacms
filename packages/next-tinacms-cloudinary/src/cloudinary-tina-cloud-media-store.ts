/**

*/

import { CloudinaryMediaStore } from './cloudinary-media-store'
import type { CloudinaryMediaStoreOptions } from './cloudinary-media-store'
import type { Client } from 'tinacms'

export const createTinaCloudCloudinaryMediaStore = (
  options?: CloudinaryMediaStoreOptions
) =>
  class TinaCloudCloudinaryMediaStore extends CloudinaryMediaStore {
    client: Client
    constructor(client: Client) {
      super(options)
      this.client = client
      this.fetchFunction = async (input: RequestInfo, init?: RequestInit) => {
        try {
          const url = input.toString()
          const query = `${url.includes('?') ? '&' : '?'}clientID=${
            client.clientId
          }`

          const res = client.authProvider.fetchWithToken(url + query, init)
          return res
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

export const TinaCloudCloudinaryMediaStore =
  createTinaCloudCloudinaryMediaStore()
