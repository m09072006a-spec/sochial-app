import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '@heroui/react'
import { FaImage, FaTimes } from 'react-icons/fa'
import { useSettings } from '../../context/SettingsContext'

export default function CreatePost() {
  const { t } = useSettings()
  const [body, setBody] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!image) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  function clearImage() {
    setImage(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function sendPost() {
    const formData = new FormData()
    if (body.trim()) formData.append('body', body.trim())
    if (image) formData.append('image', image)
    return axios.post('https://route-posts.routemisr.com/posts', formData, {
      headers: { token: localStorage.getItem('token') },
    })
  }

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: sendPost,
    onSuccess: () => {
      setBody('')
      clearImage()
      queryClient.invalidateQueries({ queryKey: ['allPosts'] })
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if ((!body.trim() && !image) || isPending) return
    mutate()
  }

  const errorMsg = (error as any)?.response?.data?.message ?? t('postFailed')
  const empty = !body.trim() && !image

  return (
    <form onSubmit={handleSubmit} className="pb-3 border-b border-[var(--glass-border)]">
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="font-semibold text-sm">{t('newPost')}</p>
        <button
          type="submit"
          disabled={isPending || empty}
          className="field rounded-full px-5 py-1.5 text-sm font-semibold flex items-center justify-center min-w-16 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <Spinner size="sm" color="current" /> : t('post')}
        </button>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={t('whatsOnMind')}
        rows={2}
        className="field w-full rounded-xl px-4 py-3 text-sm placeholder:text-[var(--muted)] resize-none outline-none"
      />

      {preview && (
        <div className="relative mt-3">
          <img src={preview} alt="" className="w-full max-h-72 object-cover rounded-2xl" />
          <button
            type="button"
            onClick={clearImage}
            aria-label={t('removeImage')}
            className="absolute top-2 end-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="field rounded-full px-3 py-1.5 text-xs flex items-center gap-2 cursor-pointer"
        >
          <FaImage className="shrink-0" />
          <span className="max-w-40 truncate">{image ? image.name : t('photo')}</span>
        </button>
      </div>

      {isError && <p className="text-sm text-red-500 mt-2">{errorMsg}</p>}
    </form>
  )
}
