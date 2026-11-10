import { useEffect, useRef, useState } from 'react'
import { FaHeart, FaRegHeart, FaRegComment, FaRetweet } from 'react-icons/fa'
import type { PostType } from '../../pages/home/Home'
import Comenet from '../comment/Comenet'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '@heroui/react'
import { useSettings } from '../../context/SettingsContext'
import { getMyId } from '../../utils/getMyId (1).ts'

interface PostCardPropsType {
  post: PostType
  allComment?: any[]
  commentsLoading?: boolean
  commentsError?: boolean
}

export default function PostCard({
  post,
  allComment,
  commentsLoading,
  commentsError,
}: PostCardPropsType) {
  const { t, locale } = useSettings()
  const [commentInput, setCommentInput] = useState('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  /* ---------- like ---------- */
  function likePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}/like`,
      {},
      { headers: { token: localStorage.getItem('token') } }
    )
  }

  const myId = getMyId()
  const likedByMe =
    post.likes?.some((l: any) => (typeof l === 'string' ? l : l?._id) === myId) ?? false

  const [liked, setLiked] = useState(likedByMe)
  const [likes, setLikes] = useState(post.likesCount)

  useEffect(() => {
    setLiked(likedByMe)
    setLikes(post.likesCount)
  }, [likedByMe, post.likesCount])

  const { mutate: toggleLike, isPending: likePending } = useMutation({
    mutationFn: likePost,
    onMutate: () => {
      const prev = { liked, likes }
      setLiked(!liked)
      setLikes(liked ? likes - 1 : likes + 1)
      return prev
    },
    onError: (_e, _v, prev) => {
      if (prev) {
        setLiked(prev.liked)
        setLikes(prev.likes)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] })
      queryClient.invalidateQueries({ queryKey: ['post', post._id] })
    },
  })

  /* ---------- comments ---------- */
  function handleCommentsClick() {
    if (allComment === undefined) navigate(`/post/${post._id}`)
    else inputRef.current?.focus()
  }

  function sendComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/comments`,
      { content: commentInput },
      { headers: { token: localStorage.getItem('token') } }
    )
  }

  const { isError, isPending, mutate } = useMutation({
    mutationFn: sendComment,
    onSuccess: () => {
      setCommentInput('')
      queryClient.invalidateQueries({ queryKey: ['comments', post._id] })
      queryClient.invalidateQueries({ queryKey: ['allPosts'] })
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!commentInput.trim() || isPending) return
    mutate()
  }

  /* ---------- share ---------- */
  const [shareOpen, setShareOpen] = useState(false)
  const [shareText, setShareText] = useState('')

  function sharePost() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/share`,
      shareText.trim() ? { body: shareText.trim() } : {},
      { headers: { token: localStorage.getItem('token') } }
    )
  }

  const {
    mutate: doShare,
    isPending: sharePending,
    isError: shareError,
  } = useMutation({
    mutationFn: sharePost,
    onSuccess: () => {
      setShareText('')
      setShareOpen(false)
      queryClient.invalidateQueries({ queryKey: ['allPosts'] })
      queryClient.invalidateQueries({ queryKey: ['post', post._id] })
    },
  })

  const iconBtn =
    'w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--field)]'

  return (
    <article className="flex gap-3 py-4 border-b border-[var(--glass-border)] last:border-b-0">
      <img src={post.user.photo} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />

      <div className="min-w-0 flex-1">
        {/* header */}
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm truncate">{post.user.name}</p>
          <Link to={`/post/${post._id}`} className="t-muted text-xs shrink-0 hover:underline">
            {new Date(post.createdAt).toLocaleDateString(locale, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Link>
        </div>

        {/* body */}
        {post.body && <p className="mt-1 text-sm break-words whitespace-pre-line">{post.body}</p>}
        {post.image && (
          <img src={post.image} className="mt-3 w-full max-h-96 object-cover rounded-2xl" alt="" />
        )}

        {/* actions */}
        <div className="mt-2 flex items-center gap-1 -ms-2">
          <button
            onClick={() => toggleLike()}
            disabled={likePending}
            className={`${iconBtn} ${liked ? 'text-red-500' : 't-muted'}`}
            aria-label="like"
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button onClick={handleCommentsClick} className={`${iconBtn} t-muted`} aria-label="comments">
            <FaRegComment />
          </button>
          <button
            onClick={() => setShareOpen((o) => !o)}
            className={`${iconBtn} ${shareOpen ? 'text-[var(--accent)]' : 't-muted'}`}
            aria-label={t('share')}
            title={t('share')}
          >
            <FaRetweet />
          </button>
        </div>

        <p className="t-muted text-xs">
          {post.commentsCount} {t('replies')} · {likes} {t('likesWord')} · {post.sharesCount} {t('sharesWord')}
        </p>

        {shareOpen && (
          <div className="mt-3 field rounded-2xl p-3">
            <textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              placeholder={t('sharePlaceholder')}
              rows={2}
              className="w-full bg-transparent text-sm resize-none outline-none placeholder:text-[var(--muted)]"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShareOpen(false)}
                className="px-3 py-1.5 rounded-full text-sm t-muted cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => doShare()}
                disabled={sharePending}
                className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[var(--accent)] text-white cursor-pointer disabled:opacity-60 flex items-center justify-center min-w-16"
              >
                {sharePending ? <Spinner size="sm" color="current" /> : t('share')}
              </button>
            </div>
            {shareError && <p className="text-xs text-red-500 mt-2">{t('shareFailed')}</p>}
          </div>
        )}

        {/* comments */}
        <div className="mt-2">
          {commentsLoading && (
            <div className="flex justify-center py-3">
              <Spinner />
            </div>
          )}
          {commentsError && (
            <p className="text-sm text-red-500 py-2">{t('commentsFailed')}</p>
          )}

          {/* في الهوم top comment، وفي صفحة البوست كل التعليقات */}
          {!allComment && post.topComment && <Comenet comment={post.topComment} postId={post._id} />}
          {allComment?.map((c) => (
            <Comenet key={c._id} comment={c} postId={post._id} />
          ))}
        </div>

        {/* add comment */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
          <input
            ref={inputRef}
            onChange={(e) => setCommentInput(e.target.value)}
            value={commentInput}
            type="text"
            placeholder={t('writeComment')}
            className="field rounded-full px-4 py-2 text-sm w-full min-w-0 outline-none placeholder:text-[var(--muted)]"
          />
          <button
            type="submit"
            disabled={isPending || !commentInput.trim()}
            className="px-3 py-2 rounded-full text-sm font-semibold text-[var(--accent)] disabled:opacity-40 cursor-pointer flex items-center justify-center min-w-14"
          >
            {isPending ? <Spinner size="sm" /> : t('send')}
          </button>
        </form>

        {isError && <p className="text-sm text-red-500 mt-1">{t('sendFailed')}</p>}
      </div>
    </article>
  )
}
