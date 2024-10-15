import React, { useState, useRef } from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import { Button } from "@mui/material"
import ReactCrop, { centerCrop, makeAspectCrop, Crop } from "react-image-crop"
import * as http from "../../http"
import { useStoreState } from "../../store"
import "react-image-crop/dist/ReactCrop.css"

type TProperties = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

export default function ChangeImage({ open, setOpen }: TProperties) {
  const user = useStoreState((state) => state.user)
  const setUser = useStoreState((state) => state.setUser)
  const fileReference = useRef<HTMLInputElement>(null)
  const [imgSource, setImgSource] = useState("")
  const imgReference = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [blob, setBlob] = useState<Blob>()
  const aspect = 2

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener("load", () =>
        setImgSource(reader.result?.toString() || "")
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  function onSave() {
    const form = new FormData()
    form.append("file", blob, "profileImg")
    http
      .updateProfile(form)
      .then((response) => {
        // response.data.user
        setUser({
          ...user,
          profileImage: response.data.user.profileImage,
        })
        setOpen(false)
      })
      .catch((error) => console.log(error))
  }

  function onCropComplete(crop) {
    const canvas = document.createElement("canvas")
    const pixelRatio = window.devicePixelRatio
    const scaleX =
      imgReference.current.naturalWidth / imgReference.current.width
    const scaleY =
      imgReference.current.naturalHeight / imgReference.current.height
    const context = canvas.getContext("2d")

    canvas.width = crop.width * pixelRatio * scaleX
    canvas.height = crop.height * pixelRatio * scaleY

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    context.imageSmoothingQuality = "high"

    context.drawImage(
      imgReference.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    )

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty")
          return
        }

        setBlob(blob)
      },
      "image/jpeg",
      1
    )
  }

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <Box>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Change Image
          <IconButton
            onClick={() => {
              setImgSource("")
              setOpen(false)
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ typography: "body1", padding: 1 }}>
          <Box style={{ width: "400px" }}>
            {!imgSource && (
              <Box
                style={{
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <input
                  type="file"
                  ref={fileReference}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={onSelectFile}
                />
                <Button onClick={() => fileReference.current.click()}>
                  Upload
                </Button>
              </Box>
            )}
            {!!imgSource && (
              <Box>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={onCropComplete}
                  minWidth={100}
                  minHeight={100}
                >
                  <img
                    style={{ width: "400px", height: "auto" }}
                    ref={imgReference}
                    alt="Crop me"
                    src={imgSource}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
                <Box style={{ display: "flex" }}>
                  <Button onClick={onSave} style={{ marginLeft: "auto" }}>
                    Save
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}
