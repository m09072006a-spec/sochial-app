import { useContext, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { authCreatedContext } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import PostCard from '../../components/post/postCard'
import CreatePost from '../../components/post/CreatePost'
import Suggestions from '../../components/Suggestions'
import { Loader } from '../../components/Loader/Loader'

export interface PostType {
  _id: string
  body: string
  privacy: string
  user: User
  sharedPost: any
  likes: any[]
  createdAt: string
  commentsCount: number
  topComment: any
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  bookmarked: boolean
  image?: string
  commentCreator: string
}

export interface User {
  _id: string
  name: string
  username: string
  photo: string
}

export default function Home() {
  const { token } = useContext(authCreatedContext)
  const { t } = useSettings()

  // all = كل البوستات | following = فيد اللي بتتابعهم (Get Home Feed)
  const [tab, setTab] = useState<'all' | 'following'>('all')

  function getPosts() {
    const url =
      tab === 'following'
        ? 'https://route-posts.routemisr.com/posts/feed?only=following&limit=20'
        : 'https://route-posts.routemisr.com/posts'
    return axios.get(url, { headers: { token } })
  }

  // ['allPosts', tab] بيتطابق مع invalidateQueries({ queryKey: ['allPosts'] }) في باقي الملفات
  const { data, isError, isLoading } = useQuery({
    queryFn: getPosts,
    queryKey: ['allPosts', tab],
  })

  const posts: PostType[] = data?.data?.data?.posts ?? []

  if (isLoading && !data) return <Loader />

  if (isError) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-lg font-semibold">{t('postsLoadFailed')}</h1>
        <p className="t-muted text-sm mt-1">{t('checkConnection')}</p>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-3 pt-4 pb-28 lg:pb-6 lg:ps-20">
      <div className="glass rounded-[28px] shadow-2xl overflow-hidden lg:grid lg:grid-cols-[1fr_20rem] lg:h-[calc(100dvh-3rem)]">
        {/* الفيد */}
        <section className="p-4 sm:p-6 lg:overflow-y-auto">
          <CreatePost />

          <div className="field rounded-full p-1 flex w-fit mt-4">
            {(['all', 'following'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                  tab === k ? 'bg-[var(--accent)] text-white' : 't-muted'
                }`}
              >
                {k === 'all' ? t('tabAll') : t('tabFollowing')}
              </button>
            ))}
          </div>

          <div className="mt-2">
            {posts.length === 0 && <p className="t-muted text-sm py-6 text-center">{t('noPosts')}</p>}
            {posts.map((post) => (
              <PostCard post={post} key={post._id} />
            ))}
          </div>
        </section>

        {/* العمود الجانبي */}
        <aside className="hidden lg:block border-s border-[var(--glass-border)] p-5 overflow-y-auto">
          <Suggestions />
        </aside>
      </div>
    </main>
  )
}
