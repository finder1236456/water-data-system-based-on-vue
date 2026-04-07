export const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '未登录或登录已过期，请重新登录。' })
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: '当前账号无权限访问该资源。' })
  }

  next()
}
