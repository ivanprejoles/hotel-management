'use client'

import 'react-dropzone-uploader/dist/styles.css';
import Dropzone, { IDropzoneProps } from 'react-dropzone-uploader'


import { X } from "lucide-react"
import Image from "next/image" 

interface FileUploadProps {
    onChange: (url?: string) => void,
    value: string,
    onFileChange: (file: File) => void
}

export const ImageUpload = ({
    onChange,
    value,
    onFileChange
}: FileUploadProps) => {
    const fileType = value?.split('.').pop()
    
    const handleChangeStatus: IDropzoneProps['onChangeStatus'] = ({ meta , file}, status) => {
        if (status ==='done') {
            onChange(meta.previewUrl)
            onFileChange(file)
        }
    }
    
    
    if (value && fileType !== 'pdf') {
        return(
            <div className="relative w-full h-full">
                <Image
                    width={0}
                    height={0}
                    fill
                    src={value}
                    alt="Upload"
                    className="w-full h-full object-cover rounded-lg"

                />
                <button
                    onClick={() => onChange('')}
                    type="button"
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-2 right-2 shadow-sm"
                >
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }
    
    return (

        <Dropzone   
            autoUpload={true}
            onChangeStatus={handleChangeStatus}
            maxFiles={1}
            multiple={false}
            inputContent="Drop G-Cash Reference"
            styles={{
                dropzone: {
                    maxWidth:'100%',
                    minHeight: '100%'
                },
                dropzoneActive: { borderColor: 'green' },
            }}
            minSizeBytes={0}
            maxSizeBytes={3097152}
            accept="image/*"
            submitButtonDisabled={files => (files.length !== 1)}
        />
    )
}