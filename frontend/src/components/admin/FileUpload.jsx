import { useState, useRef } from 'react'
import { FaCloudUploadAlt, FaFile, FaImage, FaTrash, FaSpinner } from 'react-icons/fa'
import axios from 'axios'
import imageCompression from 'browser-image-compression'

import { toast } from 'react-hot-toast'

const FileUpload = ({ label, accept, currentUrl, onUpload, type = 'image' }) => {
    const [dragging, setDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragging(false)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0]
            await uploadFile(file)
        }
    }

    const handleFileSelect = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            await uploadFile(file)
        }
    }

    const uploadFile = async (file) => {
        // Validate file type
        if (accept && !file.type.match(accept.replace('*', '.*'))) {
            toast.error(`Invalid file type. Please upload ${accept} files.`)
            return
        }

        setUploading(true)

        try {
            let fileToUpload = file

            // Compress if it's an image
            if (file.type.startsWith('image/')) {
                const options = {
                    maxSizeMB: 1,          // Max size 1MB
                    maxWidthOrHeight: 1920, // Max dimension 1920px
                    useWebWorker: true
                }
                try {
                    fileToUpload = await imageCompression(file, options)
                } catch (error) {
                    console.error('Compression failed:', error)
                    // Continue with original file if compression fails
                }
            }

            const formData = new FormData()
            formData.append('file', fileToUpload)

            const token = localStorage.getItem('adminToken')
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            })

            onUpload(response.data.url)
            toast.success('File uploaded successfully')
        } catch (error) {
            console.error('Upload failed:', error)
            toast.error('Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">{label}</label>

            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${dragging ? 'border-primary-500 bg-primary-500/10' : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'}
        `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept={accept}
                    className="hidden"
                />

                {uploading ? (
                    <div className="flex flex-col items-center justify-center py-4">
                        <FaSpinner className="animate-spin text-3xl text-primary-500 mb-2" />
                        <p className="text-gray-400">Uploading...</p>
                    </div>
                ) : currentUrl ? (
                    <div className="relative group">
                        {type === 'image' ? (
                            <div className="relative h-48 w-full">
                                <img
                                    src={currentUrl}
                                    alt="Preview"
                                    className="h-full w-full object-contain rounded-md"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                    <p className="text-white font-medium">Click or Drop to Change</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4">
                                <FaFile className="text-4xl text-gray-400 mb-2" />
                                <p className="text-primary-400 break-all">{currentUrl.split('/').pop()}</p>
                                <p className="text-xs text-gray-500 mt-2">Click or Drop to Change</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                        <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                        <p className="text-gray-300 font-medium">Click or Drag & Drop to Upload</p>
                        <p className="text-xs text-gray-500 mt-1">Supported: {accept}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FileUpload
