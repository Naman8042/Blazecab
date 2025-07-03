
import RouteModel from './onewayroute' 

export async function getPaginatedRoutes(page: number = 1, limit: number = 50) {
  const skip = (page - 1) * limit

  const [routes, total] = await Promise.all([
    RouteModel.find({})
      .sort({ _id: 1 }) // consistent order
      .skip(skip)
      .limit(limit)
      .lean(),
    RouteModel.countDocuments(),
  ])

  return {
    routes,
    total,
    page,
    pages: Math.ceil(total / limit),
  }
}
