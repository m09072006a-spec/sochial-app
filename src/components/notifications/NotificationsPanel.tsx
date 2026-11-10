import { useState } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@heroui/react'
import { FaBell } from 'react-icons/fa'
import { useSettings } from '../../context/SettingsContext'

const BASE = 'https://route-posts.routemisr.com'
const headers = () => ({ token: localStorage.getItem('token') })

/** عدّاد غير المقروء (GET /notifications/unread-count) بيتحدّث كل دقيقة */
export function useUnreadCount(enabled: boolean) {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => axios.get(`${BASE}/notifications/unread-count`, { headers: headers() }),
    enabled,
    refetchInterval: 60_000,
    select: (res) => {
      const d = res.data?.data ?? res.data
      const n = typeof d === 'number' ? d : (d?.unreadCount ?? d?.count ?? d?.unread ?? 0)
      return Number(n) || 0
    },
  })
}

function timeAgo(iso: string | undefined, locale: string) {
  if (!iso) return ''
  const diff = (new Date(iso).getTime() - Date.now()) / 1000
  if (Number.isNaN(diff)) return ''
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, sec] of units) {
    if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), unit)
  }
  return rtf.format(0, 'second')
}

export default function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { t, locale } = useSettings()
  const nav = useNavigate()
  const queryClient = useQueryClient()
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [limit, setLimit] = useState(10)

  // GET /notifications?unread=false&page=1&limit=10
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['notifications', unreadOnly, limit],
    queryFn: () =>
      axios.get(`${BASE}/notifications`, {
        headers: headers(),
        params: { unread: unreadOnly, page: 1, limit },
      }),
    placeholderData: (prev) => prev,
  })

  const raw = data?.data?.data
  const items: any[] = Array.isArray(raw) ? raw : (raw?.notifications ?? raw?.items ?? [])

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
    queryClient.invalidateQueries({ queryKey: ['unreadCount'] })
  }

  // PATCH /notifications/:id/read
  const markRead = useMutation({
    mutationFn: (id: string) => axios.patch(`${BASE}/notifications/${id}/read`, {}, { headers: headers() }),
    onSuccess: refresh,
  })

  // PATCH /notifications/read-all
  const markAll = useMutation({
    mutationFn: () => axios.patch(`${BASE}/notifications/read-all`, {}, { headers: headers() }),
    onSuccess: refresh,
  })

  function handleClick(n: any, isRead: boolean) {
    if (!isRead && n._id) markRead.mutate(n._id)

    const postId = typeof n.post === 'string' ? n.post : (n.post?._id ?? n.postId)
    if (postId) {
      nav(`/post/${postId}`)
      onClose()
    }
  }

  const pill = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${
      active ? 'bg-[var(--accent)] text-white' : 't-muted hover:bg-[var(--field)]'
    }`

  return (
    <>
      {/* بيقفل الباانل لما تدوس برّاه */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className="glass fixed z-50 flex max-h-[70vh] w-auto flex-col overflow-hidden rounded-3xl shadow-2xl text-[var(--text)]
                   bottom-24 inset-x-4
                   lg:inset-x-auto lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:start-24 lg:w-96"
      >
        <div className="flex items-center justify-between gap-2 p-4 pb-2">
          <h2 className="font-semibold">{t('notifications')}</h2>
          <button
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
            className="text-xs font-semibold text-[var(--accent)] cursor-pointer disabled:opacity-50"
          >
            {t('markAllRead')}
          </button>
        </div>

        <div className="flex gap-1 px-4 pb-2">
          <button className={pill(!unreadOnly)} onClick={() => setUnreadOnly(false)}>
            {t('tabAll')}
          </button>
          <button className={pill(unreadOnly)} onClick={() => setUnreadOnly(true)}>
            {t('unreadOnly')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          )}

          {isError && <p className="px-3 py-6 text-center text-sm text-red-500">{t('notifFailed')}</p>}

          {!isLoading && !isError && items.length === 0 && (
            <p className="t-muted px-3 py-8 text-center text-sm">{t('noNotifications')}</p>
          )}

          <ul>
            {items.map((n, i) => {
              const actor = n.actor ?? n.sender ?? n.from ?? n.user
              const text =
                n.message ?? n.text ?? n.content ?? n.title ?? String(n.type ?? '').replace(/[_-]/g, ' ')
              const isRead = Boolean(n.isRead ?? n.read ?? n.readAt)

              return (
                <li key={n._id ?? i}>
                  <button
                    onClick={() => handleClick(n, isRead)}
                    className={`flex w-full items-start gap-3 rounded-2xl p-3 text-start cursor-pointer transition-colors hover:bg-[var(--field)] ${
                      isRead ? '' : 'bg-[var(--field)]'
                    }`}
                  >
                    {actor?.photo ? (
                      <img src={actor.photo} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                    ) : (
                      <span className="field flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                        <FaBell className="t-muted" />
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-sm break-words">
                        {actor?.name && <span className="font-semibold">{actor.name} </span>}
                        {text}
                      </p>
                      <p className="t-muted mt-0.5 text-xs">{timeAgo(n.createdAt, locale)}</p>
                    </div>

                    {!isRead && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent)]" />}
                  </button>
                </li>
              )
            })}
          </ul>

          {items.length >= limit && (
            <div className="flex justify-center py-2">
              <button
                onClick={() => setLimit((l) => l + 10)}
                disabled={isFetching}
                className="field rounded-full px-5 py-1.5 text-sm cursor-pointer disabled:opacity-60"
              >
                {isFetching ? <Spinner size="sm" /> : t('loadMore')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
