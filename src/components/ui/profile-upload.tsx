import { FC, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface ProfileUploadProps {
  initialImage?: string
  onImageUpload: (file: File) => void
  className?: string
}

export const ProfileUpload: FC<ProfileUploadProps> = ({
  initialImage,
  onImageUpload,
  className = '',
}) => {
  const [preview, setPreview] = useState<string>(initialImage || '')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageUpload(file)
    }
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <Avatar className="w-32 h-32">
        <AvatarImage src={preview} />
        <AvatarFallback>
          <Upload className="w-8 h-8 text-gray-400" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2 text-center">
        <Button
          variant="outline"
          className="gap-2 text-purple-600 border-purple-600 hover:bg-purple-50"
          onClick={() => document.getElementById('profile-upload')?.click()}
        >
          <Upload size={16} />
          Upload Photo
        </Button>
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-sm text-gray-500">
          Your profile picture will be visible in your CV when you apply for internships
        </p>
      </div>
    </div>
  )
}
