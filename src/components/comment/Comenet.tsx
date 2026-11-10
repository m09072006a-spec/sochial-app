import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FaTrash } from 'react-icons/fa'
import { Spinner } from '@heroui/react'
import { useSettings } from '../../context/SettingsContext'
import { getMyId } from '../../utils/getMyId (1).ts'

interface CommentProps {
  comment: any
  postId: string
}

export default function Comenet({ comment, postId }: CommentProps) {
  const { t } = useSettings()
  const queryClient = useQueryClient()
  const creator = comment?.commentCreator

  // الحذف بيظهر لصاحب التعليق بس
  const myId = getMyId()
  const isMine = !!myId && creator?._id === myId

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () =>
      axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`, {
        headers: { token: localStorage.getItem('token') },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['allPosts'] })
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
    },
  })

  function handleDelete() {
    if (window.confirm(t('confirmDelete'))) mutate()
  }

  return (
    <div className="flex gap-2 py-2">
      <img className="w-7 h-7 rounded-full object-cover shrink-0" src={creator?.photo} alt="" />

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold truncate">{creator?.name}</p>
        <p className="text-sm break-words">{comment?.content}</p>
        {isError && <p className="text-xs text-red-500">{t('deleteFailed')}</p>}
      </div>

      {isMine && (
        <button
          onClick={handleDelete}
          disabled={isPending}
          aria-label={t('deleteComment')}
          title={t('deleteComment')}
          className="t-muted hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--field)] shrink-0 disabled:opacity-50"
        >
          {isPending ? <Spinner size="sm" /> : <FaTrash className="text-xs" />}
        </button>
      )}
    </div>
  )
}
