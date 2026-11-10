import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from '../../components/Loader/Loader'
import PostCard from '../../components/post/postCard'
import { authCreatedContext } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'

export default function PostPage() {
  const { id } = useParams()
  const { token } = useContext(authCreatedContext)
  const { t } = useSettings()

  function getPost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, { headers: { token } })
  }

  function getPostComments() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, { headers: { token } })
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: getPost,
    gcTime: 1000 * 60,
    enabled: !!id,
  })

  const {
    data: commentData,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useQuery({
    queryKey: ['comments', id],
    queryFn: getPostComments,
    enabled: !!id,
  })

  if (isLoading) return <Loader />

  if (isError) {
    return (
      <div className="px-3 py-10 text-center">
        <h1 className="text-lg font-semibold">{t('postLoadFailed')}</h1>
        <p className="t-muted text-sm mt-1">{t('checkConnection')}</p>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-3 pt-4 pb-28 lg:pb-6 lg:ps-20">
      <div className="glass rounded-[28px] shadow-2xl p-4 sm:p-6">
        <PostCard
          post={data?.data.data.post}
          allComment={commentData?.data.data.comments}
          commentsLoading={commentsLoading}
          commentsError={commentsError}
        />
      </div>
    </main>
  )
}
