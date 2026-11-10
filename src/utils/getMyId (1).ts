// بيطلع الـ user id من الـ JWT (لو فشل بيرجع null)
export function getMyId(): string | null {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.user ?? payload.id ?? payload._id ?? payload.userId ?? null
  } catch {
    return null
  }
}
