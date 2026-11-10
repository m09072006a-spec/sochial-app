import { useState } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '@heroui/react'
import { useSettings } from '../context/SettingsContext'

// ⚠️ المسارات دي افتراضية (من أسماء الـ endpoints في الـ docs)
// لو طلعت 404 غيّرها هنا بس، من Postman docs ← "Get Follow Suggestions" و "Follow/Unfollow User"
const BASE = 'https://route-posts.routemisr.com'
const SUGGESTIONS_URL = `${BASE}/users/suggestions`
const followUrl = (id: string) => `${BASE}/users/${id}/follow`

const headers = () => ({ token: localStorage.getItem('token') })

export default function Suggestions() {
  const { t } = useSettings()
  const queryClient = useQueryClient()
  const [followed, setFollowed] = useState<Record<string, boolean>>({})

  const { data, isLoading, isError } = useQuery({
    queryKey: ['suggestions'],
    queryFn: () => axios.get(SUGGESTIONS_URL, { headers: headers() }),
    retry: 1,
  })

  const users: any[] =
    data?.data?.data?.suggestions ?? data?.data?.data?.users ?? data?.data?.suggestions ?? []

  const { mutate, variables, isPending } = useMutation({
    mutationFn: (id: string) => axios.put(followUrl(id), {}, { headers: headers() }),
    onSuccess: (_res, id) => {
      setFollowed((p) => ({ ...p, [id]: !p[id] }))
      queryClient.invalidateQueries({ queryKey: ['allPosts'] })
    },
  })

  return (
    <div>
      <h2 className="text-sm font-semibold mb-4">{t('followSuggestions')}</h2>

      {isLoading && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}

      {isError && <p className="text-sm text-red-500">{t('suggestionsFailed')}</p>}

      {!isLoading && !isError && users.length === 0 && (
        <p className="t-muted text-sm">{t('noSuggestions')}</p>
      )}

      <ul className="space-y-4">
        {users.map((u) => (
          <li key={u._id} className="flex items-center gap-3">
            <img src={u.photo} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
            <p className="min-w-0 flex-1 text-sm font-medium truncate">{u.name}</p>
            <button
              onClick={() => mutate(u._id)}
              disabled={isPending && variables === u._id}
              className={`rounded-full border border-[var(--glass-border)] px-3 py-1 text-xs cursor-pointer disabled:opacity-50 transition-colors ${
                followed[u._id] ? 'field t-muted' : 'hover:bg-[var(--field)]'
              }`}
            >
              {followed[u._id] ? t('following') : t('follow')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
