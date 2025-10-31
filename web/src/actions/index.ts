// Export all server actions from a single entry point (matching web-ref pattern)
export {
  getProfileById,
  getProfileByStoreUsername,
  getProfileIdByStoreUsername,
  getProfiles,
  getProfile,
} from './profiles'

export {
  getAvailableProducts,
  getProductById,
  getProducts,
  getProductsByStoreId,
  getProductsByCreatorId,
  getProductsByStoreUsername,
  getProductsCountByStore,
} from './products'

// Aliases to match web-ref naming
export { getProfileById as getUserById } from './profiles'
export { getProfileIdByStoreUsername as getUserIdByInstagramHandle } from './profiles'
